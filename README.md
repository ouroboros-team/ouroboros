<img src="/client/src/assets/images/logo.svg" alt="Ouroboros logo" width="100%" height="144">

# Ouroboros

[![Build Status](https://travis-ci.org/ouroboros-team/ouroboros.svg?branch=master)](https://travis-ci.org/ouroboros-team/ouroboros)

Ouroboros is a peer-to-peer snake game that was created to experiment with fast-paced,
real-time, direct peer-to-peer data exchange over the WebRTC data channel.

## Building Ouroboros

- [Introduction](#introduction)
- [Getting Started: Connecting Peers with WebRTC](#getting-started-connecting-peers-with-webrtc)
- [Synchronization](#synchronization)
    - [TUs and Snake Bodies](#tus-and-snake-bodies)
    - [Collision Checking](#collision-checking)
    - [Living Snake Count and End of Game](#living-snake-count-and-end-of-game)
    - [Death Buffer](#death-buffer)
    - [Game Over Buffer](#game-over-buffer)
    - [TUs for Latency Tolerance](#tus-for-latency-tolerance)
- [Smooth Gameplay with Missing Peer Data](#smooth-gameplay-with-missing-peer-data)
    - [Prediction Algorithm](#prediction-algorithm)
    - [Convergence Technique](#convergence-technique)
    - [Predictions and Collision Checking](#predictions-and-collision-checking)
- [Authority and Consistency](#authority-and-consistency)
    - [Peer-to-Peer Messaging Transport Protocol](#peer-to-peer-messaging-transport-protocol)
    - [Peer-to-Peer Message Content](#peer-to-peer-message-content)
    - [Overlap and Redundancy in Peer Messages](#overlap-and-redundancy-in-peer-messages)
    - [Ensuring Consistency with a CRDT](#ensuring-consistency-with-a-crdt)
    - [Incorporating a CRDT](#incorporating-a-crdt)
- [Optimizations](#optimizations)
    - [Data Structure for Snake Bodies](#data-structure-for-snake-bodies)
    - [Data Structure for the Game Board](#data-structure-for-the-game-board)
    - [Head Sets for Display Boards and Collision Checking](#head-sets-for-display-boards-and-collision-checking)
    - [P2P Network Topology](#p2p-network-topology)
- [Future Work](#future-work)
    - [Automated Testing for P2P Network](#automated-testing-for-p2p-network)
    - [Latency Testing](#latency-testing)
    - [Scaling](#scaling)

### Introduction

In distributed multiplayer gaming, the client-server model has long been the dominant architecture.
Clients send inputs to a central server that updates the game state accordingly and provides an
authoritative view of the game to all connected clients. If a conflict arises between a player's
local state and the server state, the client must accept the server's view of the game. Having a
single source of truth guarantees consistency, meaning that all players will experience the same
game state.

Peer-to-peer gaming, on the other hand, has no central server that can offer this guarantee, but is
nonetheless intriguing for several reasons:

- P2P architectures are cheaper to build and maintain because they rely on peers' resources (
  processing, storage, network) rather than dedicated remote systems
- P2P architectures are trustless
- P2P architectures have no inherent single point of failure and offer high availability
- P2P architectures can offer the lowest latency by eliminating intermediaries

These are significant advantages, both for players and game developers. However, P2P gaming also
poses many challenges:

- What are the security risks of P2P communications?
- How do we mitigate the effects of latency resulting from geographical separation?
- Without the authority of a central server, how is consistency of game state maintained?

Our project, Ouroboros, is a real-time peer-to-peer multiplayer snake game that was created to take
on some of these challenges and explore this brave new world. We chose to implement a snake game
because we wanted to push the limits of using the WebRTC data channel for time-critical
communications while keeping game logic relatively simple. Turn-based games provide natural delays
that mitigate the challenges of working with direct peer-to-peer communications, but our snake game
must proceed relentlessly and smoothly forward regardless of latency and peer disconnections. Our
use case necessitated efficiency of both local processing and peer-to-peer messaging, a prediction
algorithm to fill in missing peer data, and data structures and algorithms that could ensure
eventual consistency across all peers.

In summary, our main challenges were

- Synchronization
- Providing smooth gameplay even with missing peer data
- Replicating the game state across all peers

### Getting Started: Connecting Peers with WebRTC

Peer-to-peer communication has been available natively in some browsers since the introduction of
WebRTC in 2010. WebRTC is a peer-to-peer API that is now supported natively in all major
browsers ([1](#citations)) and enables users to build P2P applications with media and data
streams. Most existing WebRTC applications make use of media streams in the area of audio- and
video-conferencing, while the WebRTC data channel is typically used to support an accompanying chat
box. However, the data channel is highly configurable and has a variety of use-cases, including
online gaming.

In Ouroboros, we use a link-sharing model to make connections between peers. When a user sends an
initial request to our server, a WebSocket connection is established and the app registers its
location (public IP address) with the server. The server then assigns a random, unique ID to the
user which is used by the app to create a sharing link that is displayed in the user interface. When
a new peer follows the link, the ID is extracted from the URL and is passed to the server to request
a connection to the peer that it represents. Once a connection is established between the two peers,
a WebRTC data channel is opened and direct peer-to-peer messaging can begin.

Under the hood, establishing a peer-to-peer connection over WebRTC is a multistep process. After a
user follows a sharing link to the game site, she sends a request to a STUN (Session Traversal
Utilities for NAT) server to determine her public IP address and whether or not she is accessible
behind her router's NAT (Network Address Translation). If she is accessible, a direct connection is
created between her and the peer associated with the ID in the sharing link. If she is not
accessible, a TURN (Traversal Using Relays around NAT) server must act as an intermediary between
her and her peers, such that it is not a direct peer-to-peer connection. ([2](#citations))

![Peer Connections via WebRTC](/client/src/assets/images/about/webrtc.png)

### Synchronization

Latency will always prevent peers from being precisely synchronized, but an approximation is
necessary for a multiplayer game to be coherent. In order to implement synchrony, we introduced
sequence numbers that we call ‘time units' or TUs.

One TU corresponds to a snake moving forward by one square. Each instance of the game has a local
timer that increments the TU after a regular interval. The real-time length of this interval is
currently 250ms (a quarter of a second), which was determined by balancing performance
considerations and user experience.

When messages are sent to other peers, TUs are used as keys for snake position coordinates:

```javascript
const positions: {
  10: { row: 6, column: 4 }, // coordinates of head at TU 10
  9: { row: 6, column: 3 }, // coordinates of head at TU 9
  8: { row: 5, column: 3 }, // etc...
  7: { row: 4, column: 3 },
  6: { row: 3, column: 3 },
};
```

When the message is received, the receiving peer will incorporate this data into their local data
structures, using the TUs to synchronize this snake's data with that of the other snakes in the
game.

#### TUs and Snake Bodies

In the classic snake game (and ours), the body of the snake follows the path of the head, so the
coordinates of the body represent the history of the coordinates of the head. For example, if a
snake is 5 squares long, those 5 squares are the current position of the head plus the previous 4
positions. Therefore, to represent the position of each snake we track the coordinates of the head
and store that history, tagging each with a TU. The snake's body is the coordinate pair at the
current TU (the head) plus as many of the coordinates from previous TUs as needed given the current
length of the snake.

```javascript
const positions: {
  10: { row: 6, column: 4 }, // coordinates of head at TU 10
  9: { row: 6, column: 3 }, // head from TU 9, now part of body
  8: { row: 5, column: 3 }, // head from TU 8...
  7: { row: 4, column: 3 }, // etc...
  6: { row: 3, column: 3 },
};
```

![Snake Heads Aggregated into Snake Bodies](/client/src/assets/images/about/snake-heads-into-bodies-complete.png)

#### Collision Checking

In our game, a collision is defined as the head of your own snake occupying the same coordinates as
a peer snake or another part of your own body. So, in order to check for collisions, we must
aggregate peer snake positions and the position of your own snake, minus its head, into a board.
Then, we simply check the coordinates of the head against this aggregate. If that position is
occupied, there has been a collision and your snake is now dead.

#### Living Snake Count and End of Game

A count of living snakes is maintained throughout the game. Each time a peer snake dies, the count
is decremented. Maintaining this count allows us to check for the game over conditions with minimal
processing. In a single-player game, the game ends when the sole snake dies. In a multiplayer game,
the game ends when one or zero snakes remain (two snakes may die simultaneously in a head-on
collision).

#### Death Buffer

When your snake dies, you announce a TU of death to your peers. This is immediately captured in your
peers' local snake data structure, but their living snake count is not decremented if they have not
yet reached the TU at which your snake died. In that case, the TU is added to the death buffer. At
every TU tick, the death buffer is checked and any corresponding deaths are applied by decrementing
the living snake count accordingly.

#### Game Over Buffer

When the game over condition is reached, a player will announce this to the other players after a
short delay. The delay is put in place to allow the announcing player to receive any pending peer
messages so that the winner(s) is/are identified as accurately as possible. When players receive a
game over announcement flagged with a TU, if the player has not yet reached this TU, this message is
diverted to the game over buffer. Just like the death buffer, the game over buffer is checked with
every TU tick and any corresponding game over announcement is applied. This allows players that are
slightly out of sync with their peers to complete the last few moves of the game, allowing all peers
to have a more complete and accurate view of the final game state.

#### TUs for Latency Tolerance

In order to ensure a good user experience, it is necessary to impose a latency threshold. There are
mechanisms in place (discussed later) to provide smooth gameplay despite some latency. However, too
much latency makes the game unplayable. Periodically, the local TU timer is compared to the most
recent TUs from each peer snake. If the discrepancy between the local timer and a peer's most recent
TU exceeds latency threshold, that peer is removed from the current game; their snake is marked as
dead, and they are shown an ‘out-of-sync' message.

### Smooth Gameplay with Missing Peer Data

Network latency & interruptions can delay P2P messages, which means that peer data may not always be
available when it is needed. How do we ensure a smooth gaming experience when peer data is missing?

The lockstep model of peer-to-peer gaming ensures consistency of game state across all peers by
waiting for all peer data before moving the game state forward. However, this method causes all
players to move at the speed of the player with the most latency and therefore will often result in
a slow and irregular pace. This model is entirely incompatible with a fast, reflex-based game like
ours, which must proceed at a quick and steady pace to be enjoyable for players.

Because we cannot wait for data, we must be able to predict avatar movements when peer data is
absent. Then, when new peer data is received, these predictions must be discarded and new data must
be incorporated into existing data structures. The process of predicting peer positions and then
reconciling new peer data with these predictions is called dead reckoning, and it is used in many
kinds of multiplayer games ([3](#citations)). Using predictions means that a player's view of the
game will not always be precisely accurate, and it will temporarily diverge from the view of the
other peers, but it allows for smooth, fast gameplay and any discrepancies are only temporary (more
on this below). Moreover, this technique is a good fit for a snake game because the snake will
continue moving in a single direction until its owner instructs it to do otherwise, making it easy
for players to predict the other snakes' movements with a fairly high degree of accuracy.

#### Prediction Algorithm

A snake avatar moves forward until its player tells it to change direction by pressing an arrow key.
As we have seen, the position of a snake's head is represented by row-column coordinates. The next
position can be calculated with the last known coordinates and direction. If the top-left square is
{row: 0, column: 0} and your snake's head coordinates are {row: 5, column: 3}, it works like this:

| Direction | Action           | Next Head Position  |
|-----------|------------------|---------------------|
| left      | decrement column | {row: 5, column: 2} |
| right     | increment column | {row: 5, column: 4} |
| up        | decrement row    | {row: 4, column: 3} |
| down      | increment row    | {row: 6, column: 3} |

While peer data is unavailable, this prediction algorithm can be used to fill in missing TUs until
real data is received.

#### Convergence Technique

When our predictions do not match the actual peer data that is later received, we need a convergence
technique to reconcile the discrepancies. The easiest solution to resolving these differences is to
keep predictions and canonical data separate. In this way, the board that the player sees is a mix
of canonical data and disposable predictions, while the data they hold for each peer's snake is kept
in a separate structure and is only updated with real data from the peer. Every time snakes advance
one square on the board, we discard the old board data, redraw the board with any new peer data, and
then apply any necessary predictions.

#### Predictions and Collision Checking

Predicted data is not used for collision checking. As a result, apparent collisions in the board may
not be confirmed by real peer data and will not cause a snake to die. Although this policy may seem
counterintuitive in terms of user experience, it is necessary to preserve consistency across peers.
Predictions are constantly corrected by incoming peer data, which means that observed collisions
will be also be corrected, allowing players to understand the discrepancy and the resulting
behavior.

### Authority and Consistency

A client-server game uses its authoritative central server to ensure a consistent game state for all
players. So who is the authority in a peer-to-peer game? In Ouroboros, each peer functions as the
authority for his/her own avatar. Each time a move is committed (corresponding to a TU tick), this
information is broadcast to the other peers. Each peer must then efficiently incorporate this data
into her local data structure in such a way that eventual consistency is ensured.

#### Peer-to-Peer Messaging Transport Protocol

The WebRTC data channel is implemented with Stream Control Transmission Protocol (SCTP), which can
be configured to behave like TCP or UDP depending on the desired functionality. Using a reliable
TCP-like configuration ensures ordered delivery of packets. Although this seems highly desirable,
reliability is currently implemented by mandating a series of confirmation and counter-confirmation
messages from the involved parties, which would result in excessive peer-to-peer chatter that would
take priority and most likely cause delays for game-relevant messages.

Given the limitations of reliable messaging and its potential impact on performance, we needed to
choose the unreliable, UDP-like configuration for our peer-to-peer messages. However, this decision
meant that we needed to implement ways to deal with lost and/or unordered
messages. ([4](#citations))

#### Peer-to-Peer Message Content

As we discussed above, if a snake's current position is known, only a directional command is needed
to know its next position. This suggests that once all snakes' starting positions are known,
peer-to-peer messages need only contain directional commands (operations). However, with an
unreliable transport protocol messages can be delayed, received out of order, duplicated, or lost
altogether. So, for example, if a player sends left, right, up for their snake, one peer may receive
only left, up, while another receives left, up, right and a third receives left, left, right. These
discrepancies will cause the position of that snake to be very different for the three peers,
resulting in incoherent gameplay.

It is clear that sending directional commands alone can easily introduce state distortions and that
this approach does not provide the means to detect and resolve these inconsistencies. A solution is
that each peer broadcast not only directional commands, but also coordinate pairs keyed by TUs for
synchronization ([5](#citations)). Absolute coordinates provide much more robust data than
relative directional commands, and TUs allow us to coordinate data between all the peers.

Moreover, we need strategies to prevent data loss when messages are dropped, and to keep the game
state from being distorted when messages are duplicated or received out of order.

#### Overlap and Redundancy in Peer Messages

Because our messaging protocol does not guarantee that messages will be received, we must structure
our messaging to provide redundancy so that dropped messages do not result in data loss. So, with
each TU tick, each player broadcasts a range of coordinates including the most recent (the current
position of the snake's head). Although one message may be lost, a regular stream of overlapping
updates helps to ensure that all information will eventually be received anyway. ([6](#citations))

#### Ensuring Consistency with a CRDT

A conflict-free replicated data type, or CRDT, is any distributed data structure that guarantees
eventual consistency of replicas that are updated independently and without direct coordination.
CRDTs are used by no-SQL databases (ex. Redis and Riak) and collaborative text editors (ex. Atom's
Teletype). There are two types of CRDTs: operation-based and state-based. Operation-based CRDTs
require reliable messaging that prevents duplicates. Because this is not an option for our use case,
we require a state-based CRDT. Also known as a convergent replicated data type (CvRDT), a
state-based CRDT must merge new data with the local state with operations that are **idempotent** (
repeating the same operation produces the same result), **commutative** (operations can be done in
any
order), and **associative** (operations can be grouped in any way). Restricting operations to meet
these
criteria ensures that accurate replicas can be created for all peers even when messages are
duplicated or received out of order.

| Property      | Description                                                                            | Example                                 |
|---------------|----------------------------------------------------------------------------------------|-----------------------------------------|
| Idempotency   | operations will produce the same result no matter how many times they are executed     | `x * 1 = x` and `x * 1 * 1 * 1 = x`     |
| Commutitivity | operations will produce the same result no matter the order in which they are executed | `x + y = z` and `y + x = z`             |
| Associativity | operations will produce the same result no matter how they are grouped together        | `(a + b) + c = d` and `a + (b + c) = d` |

#### Incorporating a CRDT

Snake states are represented by a variation of the Grow-only Set (G-set) CRDT ([7](#citations)).
Whenever new snake
data is received, any TUs newer than existing data are simply added to the collection. Changes in
direction are made whenever the most recent TU in the message is the same or greater than the most
recent TU in the local data structure.

So, if the current state of snake 1 is...

```
{
    id: 1,
    direction: ‘left',
    positions: {
        139: { row: 5, column: 4 },
        138: { row: 5, column: 5 },
        // ...
    }
}
```

...and we receive the following data from the peer controlling snake 1...

```
{
    id: 1,
    direction: ‘up',
    positions: {
        141: { row: 4, column: 3 },
        140: { row: 5, column: 3 },
        139: { row: 5, column: 4 },
        138: { row: 5, column: 5 },
        // ...
    }
}
```

...TUs 140 and 141 are added to our state and the direction command is changed to up. The operation
here is adding new key-value pairs to a JavaScript object, which is idempotent, commutative, and
associative, meeting all the criteria of a state-based CRDT.

It is also important to note that states for old TUs will eventually be discarded in order to
prevent snake states from becoming excessively large and unwieldy (high space complexity). This
operation does not strictly follow the constraints of a CRDT because it could introduce
discrepancies between peers, but the nature of the game means that data from TUs that are more than
a few seconds in the past are no longer relevant to gameplay and can be safely discarded.

### Optimizations

#### Data Structure for Snake Bodies

We had three requirements for our snake data structure:

- Fast insertion of new coordinates
- Fast deletion of old coordinates
- Fast lookup by TU for collision checking

Initially, we implemented snake bodies as queues using arrays. This gave us the `O(1)` insertion and
deletion we needed, but we did not have a correspondence between coordinates and TUs that allowed
fast lookup by TU.

Ideally, we wanted to use a linked hash map, which is the combination of a hash (key-value pairs)
and a doubly-linked list with pointers to the head (first) and tail (last) elements that allow you
to traverse through the hash elements in order. However, linked hash maps are not natively
implemented in JavaScript, so we implemented an approximation that fulfills all our requirements:

```
positions: {
    newest: 25,
    oldest: 11,
    byKey: {
        11: { row: 17, column: 4 },
        12: { row: 17, column: 5 },
        13: { row: 17, column: 6 },
        14: { row: 16, column: 6 },
        15: { row: 15, column: 6 },
        16: { row: 15, column: 7 },
        17: { row: 15, column: 8 },
        18: { row: 15, column: 9 },
        19: { row: 15, column: 10 },
        20: { row: 14, column: 10 },
        21: { row: 14, column: 9 },
        22: { row: 14, column: 8 },
        23: { row: 14, column: 7 },
        24: { row: 15, column: 7 },
        25: { row: 15, column: 8 },
    }
}
```

In the structure above, the `byKey` object is a hash where TUs are the keys and coordinate pairs are
the values. The `newest` and `oldest` values are simply integers that correspond with the newest and
oldest TUs contained in `byKey`. The TUs in `byKey` will be sequential and will fall within the
range defined by `newest` and `oldest`, so we can use `newest` and `oldest` as the starting points
to iterate through the collection starting at the head (`newest`) or tail (`oldest`) as in a linked
list. This structure meets all our criteria, giving us `O(1)` lookup by TU, `O(1)` insertion,
and `O(1)`
deletion:

```javascript
const add = (snake, tu, coordinates) => {
  snake.positions.byKey[tu] = coordinates;

  if (snake.positions.newest < tu) {
    snake.positions.newest = tu;
  }
};

const removeOldest = (snake) => {
  delete snake.positions.byKey[snake.positions.oldest];
  snake.positions.oldest += 1;
};

const lookup = (snake, tu) => (
  snake.positions.byKey[tu]
);
```

#### Data Structure for the Game Board

The game board, which is used for display and for collision checking, was initially implemented as a
sparse matrix using nested arrays:

```javascript
const board = [[], [undefined, undefined, snake]];
const snakeInBoard = board[1][2];
```

This provided us `O(1)` time complexity for lookup. However, this structure was not very space
efficient because we had to insert many undefined values and empty arrays in order to shift data
into the correct indexes.

We improved the space efficiency by switching to a two-dimensional hash, eliminating the need for
undefined placeholders:

```javascript
const board = { 1: { 2: snake } };
const snakeInBoard = board[1][2];
```

The only disadvantage to this structure was that merging such structures necessitated a deep merge
instead of a more efficient shallow merge. In order to convert this two-dimensional object into a
one-dimensional object, we needed to shift away from using coordinates, like this...

```
|-------------|-------------|-------------|
| [ 0 ] [ 0 ] | [ 0 ] [ 1 ] | [ 0 ] [ 2 ] |
| [ 1 ] [ 0 ] | [ 1 ] [ 1 ] | [ 1 ] [ 2 ] |
| [ 2 ] [ 0 ] | [ 2 ] [ 1 ] | [ 2 ] [ 2 ] |
|-------------|-------------|-------------|
```

...to using sequential numbers, which are easily converted to and from coordinates (squareNumber =
row * gridSize + column):

```
|---|---|---|
| 0 | 1 | 2 |
| 3 | 4 | 5 |
| 6 | 7 | 8 |
|---|---|---|
```

```javascript
const board = { 5: snake };
const snakeInBoard = board[5];
```

This structure gave us `O(1)` lookup by square number and efficient shallow merging.

### Head Sets for Display Boards and Collision Checking

In order to display a game board or to check for snake collisions, snake data must be aggregated
into boards. It would be very inefficient to re-aggregate boards from snake data each time a new
board was needed, so we implemented an in-between data structure: head sets.

Each head set is an aggregation of all snake heads for a particular TU. Because a snake body is
actually a set of head positions for a range of TUs, aggregating snake data into boards becomes a
matter of aggregating head sets. In other words, snake data is aggregated into head sets as it is
received, and head sets are subsequently aggregated into boards. Because the head sets are reusable
for a range of TUs that increases as snake lengths increase, using them dramatically improves
efficiency of aggregating boards for collision checking and display.

![Head Sets into Boards](/client/src/assets/images/about/head-sets-into-boards-complete.png)

The local snake is not included in the head sets to prevent the local snake from overwriting another
snake's coordinates, which would complicate the detection of collisions. A board that will be used
to check for collisions should include all head sets (all peer snake coordinates) for the relevant
TU range, and all the coordinates for the local snake except for the head. If the coordinates of
the local snake's head are present in this aggregation (despite the fact that the snake's actual
head was excluded from it), then the local snake's head has collided with another snake or another
part of its own body.

In the case of a board that will be used for display, we must include the relevant head sets, the
entire local snake, and predictions for missing snake data. Because display boards contain this
predicted data, they cannot be treated as authoritative and must be discarded when new data is
received. However, the snake data and head sets are both authoritative data, which is why head sets
can be used for collision checking. Like snake bodies, head sets are also CRDTs, and operations on
head sets are idempotent, commutative, and associative to protect their integrity.

#### P2P Network Topology

When selecting a P2P network topology, our goal was to minimize the effect of latency as much as
possible by eliminating intermediaries between peers. The topology that best accomplishes this is a
fully-connected or full-mesh structure. In this structure, each peer is connected directly to all
other peers with no intermediaries. This eliminates the need to relay messages, which would compound
latency between peers. Although it requires more effort in the initial setup, once a full-mesh
network is in place broadcasting becomes a simple matter of iterating through all connections. This
model has a higher bandwidth overhead because each message is sent individually (no message
aggregation), but this is not a concern for the small, text-based messages that are exchanged in
Ouroboros.

![Full-Mesh Peer-to-Peer Network Topology](/client/src/assets/images/about/full-mesh.png)

### Future Work

#### Automated Testing for P2P Network

All testing of our P2P network was manual, which is inefficient and error-prone. Our initial
research suggests that simulating P2P networks is a very complex task ([8](#citations)), but we are
interested in exploring the possibilities in more depth in the future.

#### Latency Testing

We have chosen game settings to broadly accommodate peer groups with moderate-to-low latency. If we
were able to test the latency between peers in a particular group, we could adjust the game settings
to optimize performance for that specific group. This could be as simple as implementing a simple
peer-to-peer ping test and developing criteria for adjusting game settings accordingly.

#### Scaling

Ouroboros currently supports up to 15 players on a 40x40 grid. Scaling up the number of players or
expanding the game world would offer several interesting challenges. For one, increasing the number
of players would make our full-mesh peer-to-peer topology impractical. We would need to select a new
configuration that would reduce the number of peer connections while still keeping the number of
intermediary nodes to a minimum. Changing our topology would also fundamentally change our messaging
patterns, so we would need to develop a new method of aggregating and disseminating peer messages as
efficiently as possible. Increasing the number of peers would also eventually cause a computation
bottleneck. We might be able to address this by having peers share larger chunks of state (head sets
or boards, perhaps) so that local computation is reduced. If the playing grid were only one small
part of a larger game world, we would require an interest algorithm to reduce the amount of game
state held by each individual player.

### Citations

| Number | Author/Creator                                              | Publication, Organization, or Website                                                           | Title                                                                                                                     | URL                                                                                | Date                    |
|--------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|-------------------------|
| 1      | CanIUse.com                                                 | CanIUse.com                                                                                     | Can I use webrtc?                                                                                                         | https://caniuse.com/#search=webrtc                                                 | Accessed April 19, 2018 |
| 2      | Sam Dutton                                                  | HTML5Rocks.com                                                                                  | WebRTC in the Real World: STUN, TURN and Signaling                                                                        | https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/                     | November 4, 2013        |
| 3      | Jouni Smed, Timo Kaukoranta, and Harri Hakonen              | Turku Centre for Computer Science, TUCS Technical Report No. 454, Pages 7-9                     | A Review on Networking and Multiplayer Computer Games                                                                     | http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.16.2565&rep=rep1&type=pdf | April 2002              |
| 4      | Glenn Fiedler                                               | Gaffer On Games blog                                                                            | UDP vs. TCP: Which Protocol is Best for Games?                                                                            | https://gafferongames.com/post/udp_vs_tcp/                                         | October 1, 2008         |
| 5      | Glenn Fiedler                                               | Gaffer On Games blog                                                                            | State Synchronization: Keeping Simulations in Sync by Sending State                                                       | https://gafferongames.com/post/state_synchronization/                              | January 5, 2015         |
| 6      | Paulo Sérgio Almeida, Ali Shoker, and Carlos Baquero        | Journal of Parallel and Distributed Computing, Volume 111, Pages 162-173                        | Delta State Replicated Data Types                                                                                         | https://doi.org/10.1016/j.jpdc.2017.08.003                                         | January 2018            |
| 7      | Marc Shapiro, Nuno Preguiça, Carlos Baquero, Marek Zawirski | INRIA: French Institute for Research in Computer Science and Automation                         | A Comprehensive Study of Convergent and Commutative Replicated Data Types                                                 | https://hal.inria.fr/inria-00555588/document                                       | 2011                    |
| 8      | Shivangi Surati, Devesh C. Jinwala, and Sanjay Garg         | Engineering Science and Technology, an International Journal, Volume 20, Issue 2, Pages 705-720 | A Survey of Simulators for P2P Overlay Networks with a Case Study of the P2P Tree Overlay Using an Event-Driven Simulator | https://doi.org/10.1016/j.jestch.2016.12.010                                       | April 2017              |

## Running Locally

```
git clone https://github.com/ouroboros-team/ouroboros.git
cd ouroboros
yarn install

cd client
yarn install

cd ..
yarn start
```
