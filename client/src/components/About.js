import React from 'react';

import Citation from './Citation';

const About = () => (
  <main className='container'>
    <h1>Building Ouroboros</h1>
    <aside>Hover over the blue circles for citations
      <Citation creator='Example Author' url='https://example.com' />
    </aside>
    <h2>Introduction</h2>
    <p>In distributed multiplayer online gaming, the client-server model has
      long been the dominant architecture. Clients send inputs to a central
      server that updates the game state accordingly and provides an
      authoritative view of the game to all connected clients. If a conflict
      arises between a player’s local state and the server state, the client
      must accept the server’s view of the game. Having a single source of truth
      guarantees consistency, meaning that all players will experience the same
      game state.</p>
    <p>Peer-to-peer gaming, on the other hand, has no central server that can
      offer this guarantee, but is nonetheless intriguing for several
      reasons:</p>
    <ul>
      <li>P2P architectures are cheaper to build and maintain because they rely
        on peers’ resources (processing, storage, network) rather than dedicated
        remote systems
      </li>
      <li>P2P architectures are trustless</li>
      <li>P2P architectures have no inherent single point of failure and offer
        high availability
      </li>
      <li>P2P architectures can offer the lowest latency by eliminating
        intermediaries
      </li>
    </ul>
    <p>These are significant advantages, both for players and game developers.
      However, P2P gaming also poses many challenges:</p>
    <ul>
      <li>What are the security risks of P2P communications?</li>
      <li>How do we mitigate the effects of latency resulting from geographical
        separation?
      </li>
      <li>Without the authority of a central server, how is consistency of game
        state maintained?
      </li>
    </ul>
    <p>Our project, Ouroboros, is a real-time peer-to-peer multiplayer snake
      game that was created to take on some of these challenges and explore this
      brave new world. We chose to implement a snake game because we wanted to
      push the limits of using the WebRTC data channel for time-critical
      communications while keeping game logic relatively simple. Turn-based
      games provide natural delays that mitigate the challenges of working with
      direct peer-to-peer communications, but our snake game proceeds
      relentlessly and smoothly forward regardless of latency and peer
      disconnections. Our use case necessitated efficiency of both local
      processing and peer-to-peer messaging, a prediction algorithm to fill in
      missing peer data, and data structures and algorithms that ensured
      eventual consistency across all peers.</p>
    <p>In summary, our main challenges in building Ouroboros were</p>
    <ul>
      <li>Synchronization</li>
      <li>Providing smooth gameplay even when peer data is missing</li>
      <li>Replicating the game state across all peers</li>
    </ul>

    <h2>Background: WebRTC</h2>
    <p>Peer-to-peer communication has been available natively in some browsers
      since the introduction of WebRTC in 2010. WebRTC is a peer-to-peer API
      that is now supported natively in all major browsers
      <Citation
        creator='CanIUse.com'
        url='https://caniuse.com/#search=webrtc'
      />
      and enables users to build
      P2P applications with media and data streams. Most existing WebRTC
      applications make use of media streams in the area of audio- and
      video-conferencing, while the WebRTC data channel is typically used to
      support an accompanying chat box. However, the data channel is highly
      configurable and has a variety of use-cases, including online gaming.</p>
    <h2>Synchronization</h2>
    <p>Latency will always prevent peers from being precisely synchronized, but
      an approximation is necessary for a multiplayer game to be coherent. In
      order to implement synchrony, we introduced sequence numbers that we call
      ‘time units’ or TUs.</p>
    <p>One TU corresponds to a snake moving forward by one square. Each instance
      of the game has a local timer that increments the TU after a regular
      interval. The real-time length of this interval is currently 250ms (a
      quarter of a second), which was determined by balancing performance
      considerations and user experience.</p>
    <p>When messages are sent to other peers, TUs are used as keys for snake
      position coordinates:</p>
    <pre>Code here</pre>
    <p>When the message is received, the receiving peer will incorporate this
      data into their local data structures, using the TUs to synchronize this
      snake’s data with that of the other snakes in the game.</p>
    <h3>TUs and Snake Bodies</h3>
    <p>In the classic snake game (and ours), the body of the snake follows the
      path of the head, so the coordinates of the body represent the history of
      the coordinates of the head. For example, if a snake is 4 squares long,
      those 4 squares are the current position of the head plus the previous 3
      positions. Therefore, to represent the position of each snake we track the
      coordinates of the head and store that history, flagging each with a TU.
      The snake’s body is the coordinate pair at the current TU (the head) plus
      as many of the coordinates from previous TUs as needed given the current
      length of the snake.</p>
    <pre>Code here</pre>
    <h3>Collision Checking</h3>
    <p>In our game, a collision is defined as the head of your own snake
      occupying the coordinates as a peer snake or another part of your own
      body. So, in order to check for collisions, we must aggregate peer snake
      positions and the position of your own snake, minus its head, into a
      board. Then, we simply check the coordinates of the head against this
      aggregate. If that position is occupied, there has been a collision and
      your snake is now dead.</p>
    <h3>Death Buffer</h3>
    <p>When your snake dies, you announce a TU of death to your peers. If the
      receiving peer has not yet reached the TU at which your snake died, this
      information will be added to the death buffer. At every TU tick, the death
      buffer is checked and any corresponding deaths are applied.</p>
    <h3>Living Snake Count and End of Game</h3>
    <p>A count of living snakes is maintained throughout the game. Each time a
      peer snake dies (either directly or by way of the death buffer), the count
      is decremented. Maintaining this count allows us to check for the game
      over conditions with minimal processing. In a single-player game, the game
      ends when the sole snake dies. In a multi-player game, the game ends when
      one or zero snakes remain (two snakes may die simultaneously in a head-on
      collision).</p>
    <h3>Game Over Buffer</h3>
    <p>When the game over condition is reached, a player will announce this to
      the other players after a short delay. The delay is put in place to allow
      the announcing player to receive any pending peer messages so that the
      winner(s) is/are identified as accurately as possible. When players
      receive a game over announcement flagged with a TU, if the player has not
      yet reached this TU, this message is diverted to the game over buffer.
      Just like the death buffer, the game over buffer is checked with every TU
      tick and any corresponding game over announcement is applied. This allows
      players that are slightly out of sync with their peers to complete the
      last few moves of the game, allowing all peers to have a more complete and
      accurate view of the final game state.</p>
    <h3>TUs for Latency Tolerance</h3>
    <p>In order to ensure a good user experience, it is necessary to impose a
      latency threshold. There are mechanisms in place (discussed later) to
      provide smooth gameplay despite some latency. However, too much latency
      makes the game unplayable. Periodically, the local TU timer is compared to
      the most recent TUs from each peer snake. If the discrepancy between the
      local timer and a peer’s most recent TU exceeds latency threshold, that
      peer is removed from the current game; their snake is marked as dead, and
      they are shown an ‘out-of-sync’ message.</p>
    <h2>Smooth Gameplay with Missing Peer Data</h2>
    <p>Network latency & interruptions can delay P2P messages, which means that
      peer data may not always be available when it is needed. How do we ensure
      a smooth gaming experience when peer data is missing?</p>
    <p>The lockstep model of peer-to-peer gaming ensures consistency of game
      state across all peers by waiting for all peer data before moving the game
      state forward. However, this method causes all players to move at the
      speed of the player with the most latency and therefore will often result
      in a slow and irregular pace. This model is entirely incompatible with a
      fast, reflex-based game like ours, which must proceed at a quick and
      steady pace to be enjoyable for players.</p>
    <p>Because we cannot wait for data, we must be able to predict avatar
      movements when peer data is absent. Then, when new peer data is received,
      these predictions must be discarded and new data must be incorporated into
      existing data structures. The process of predicting peer positions and
      then reconciling new peer data with these predictions is called dead
      reckoning, and it is used in many kinds of multiplayer games.
      <Citation
        creator='Jouni Smed, Timo Kaukoranta, and Harri Hakonen'
        url='http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.16.2565&rep=rep1&type=pdf'
        title='A Review on Networking and Multiplayer Computer Games'
        contributingOrganization='Turku Centre for Computer Science'
        comment='Pages 7-9'
      />
      Using predictions means that a player’s view of the game will not always
      be precisely accurate and it will temporarily diverge from the view of the
      other peers, but it allows for smooth, fast gameplay and any discrepancies
      are only temporary (more on this below). Moreover, this technique is a
      good fit for a snake game because the snake will continue moving in a
      single direction until its owner instructs it to do otherwise, making it
      easy for players to predict the other snakes’ movements with a fairly high
      degree of accuracy.</p>
    <h3>Prediction Algorithm</h3>
    <p>A snake avatar moves forward until its player tells it to change
      direction by pressing an arrow key. As we have seen, the position of a
      snake’s head is represented by row-column coordinates. The next position
      can be calculated with the last known coordinates and direction. If the
      top-left square is <code>&#123;row: 0, column: 0&#125;</code> and your
      snake’s head coordinates
      are <code>&#123;row: 5, column: 3&#125;</code>, it works like this:</p>

    <table className='align-center'>
      <thead>
      <tr>
        <th>Direction</th>
        <th>Action</th>
        <th>Next Head Position</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>left</td>
        <td>decrement column</td>
        <td><code>&#123;row: 5, column: 2&#125;</code></td>
      </tr>
      <tr>
        <td>right</td>
        <td>increment column</td>
        <td><code>&#123;row: 5, column: 4&#125;</code></td>
      </tr>
      <tr>
        <td>up</td>
        <td>decrement row</td>
        <td><code>&#123;row: 4, column: 3&#125;</code></td>
      </tr>
      <tr>
        <td>down</td>
        <td>increment row</td>
        <td><code>&#123;row: 6, column: 3&#125;</code></td>
      </tr>
      </tbody>
    </table>

    <p>While peer data is unavailable, this prediction algorithm can be used to
      fill in missing TUs until real data is received.</p>
    <h3>Convergence Technique</h3>
    <p>When our predictions do not match the actual peer data that is later
      received, we need a convergence technique to reconcile the discrepancies.
      The easiest solution to resolving these differences is to keep predictions
      and canonical data separate. In this way, the board that the player sees
      is a mix of canonical data and disposable predictions, while the data they
      hold for each peer’s snake is kept in a separate structure and is only
      updated with real data from the peer. Every time snakes advance one square
      on the board, we discard the old board data, redraw the board with any new
      peer data, and then apply any necessary predictions.</p>
    <h3>Predictions and Collision Checking</h3>
    <p>Predicted data is not used for collision checking. As a result, apparent
      collisions in the board may not be confirmed by real peer data and will
      not cause a snake to die. Although this policy may seem counterintuitive
      in terms of user experience, it is necessary to preserve consistency
      across peers. Predictions are constantly corrected by incoming peer data,
      which means that observed collisions will be also be corrected, allowing
      players to understand the discrepancy and the resulting behavior.</p>

    <h2>Authority and Consistency</h2>
    <p>A client-server game uses its authoritative central server to ensure a
      consistent game state for all players. So who is the authority in a
      peer-to-peer game? In Ouroboros, each peer functions as the authority for
      his/her own avatar. Each time a move is committed (corresponding to a TU
      tick), this information is broadcast to the other peers. Each peer must
      then efficiently incorporate this data into her local data structure in
      such a way that eventual consistency is ensured.</p>
    <h3>Peer-to-Peer Messaging Transport Protocol</h3>
    <p>The WebRTC data channel is implemented with Stream Control Transmission
      Protocol (SCTP), which can be configured to behave like TCP or UDP
      depending on the desired functionality. Using a reliable TCP-like
      configuration ensures ordered delivery of packets. Although this seems
      highly desirable, reliability is currently implemented by mandating a
      series of confirmation and counter-confirmation messages from the involved
      parties, which would result in excessive peer-to-peer chatter that would
      take priority and most likely cause delays for game-relevant messages.</p>
    <p>Given the limitations of reliable messaging and its potential impact on
      performance, we needed to choose the unreliable, UDP-like configuration
      for our peer-to-peer messages. However, this decision meant that we needed
      to implement ways to deal with lost and/or unordered messages.
      <Citation
        creator='Glenn Fiedler'
        title='UDP vs. TCP: Which Protocol is Best for Games?'
        creationDate='October 1, 2008'
        url='https://gafferongames.com/post/udp_vs_tcp/'
        comment='Gaffer On Games blog'
      /></p>
    <h3>Peer-to-Peer Message Content</h3>
    <p>As we discussed above, if a snake’s current position is known, only a
      directional command is needed to know its next position. This suggests
      that once all snakes’ starting positions are known, peer-to-peer messages
      need only contain directional commands (operations). However, with an
      unreliable transport protocol messages can be delayed, received out of
      order, duplicated, or lost altogether. So, for example, if a player
      sends <code>left, right, up</code> for their snake, one peer may
      receive only <code>left, up</code>, while another receives <code>left, up,
        right</code> and a third receives <code>left, left, right</code>. These
      discrepancies will cause the position of that snake to be very different
      for the three peers, resulting in incoherent gameplay.</p>
    <p>It is clear that sending directional commands alone can easily introduce
      state distortions and that this approach does not provide the means to
      detect and resolve these inconsistencies. A solution is that each peer
      broadcast not only directional commands, but also coordinate pairs keyed
      by TUs for synchronization.
      <Citation
        creator='Glenn Fiedler'
        title='State Synchronization: Keeping Simulations in Sync by Sending State'
        creationDate='January 5, 2015'
        url='https://gafferongames.com/post/state_synchronization/'
        comment='Gaffer On Games blog'
      /> Absolute coordinates provide much more robust
      data than relative directional commands, and TUs allow us to coordinate
      data between all the peers.</p>
    <p>Moreover, we need strategies to prevent data loss when messages are
      dropped, and to keep the game state from being distorted when messages are
      duplicated or received out of order.</p>
    <h3>Overlap and Redundancy in Peer Messages</h3>
    <p>Because our messaging protocol does not guarantee that messages will be
      received, we must structure our messaging to provide redundancy so that
      dropped messages do not result in data loss. So, with each TU tick, each
      player broadcasts a range of coordinates including the most recent (the
      current position of the snake’s head). Although one message may be lost, a
      regular stream of overlapping updates helps to ensure that all information
      will eventually be received anyway.
      <Citation
        creator='Paulo Sérgio Almeida, Ali Shoker, and Carlos Baquero'
        url='https://doi.org/10.1016/j.jpdc.2017.08.003'
        title='Delta State Replicated Data Types'
        comment='Journal of Parallel and Distributed Computing, Volume 111, January 2018, Pages 162-173'
      />
    </p>
    <h3>Ensuring Consistency with a CRDT</h3>
    <p>A conflict-free replicated data type, or <b>CRDT</b>, is any distributed
      data
      structure that guarantees eventual consistency of replicas that are
      updated independently and without direct coordination. CRDTs are used by
      no-SQL databases (ex. Redis and Riak) and collaborative text editors (ex.
      Atom’s Teletype). There are two types of CRDTs: operation-based and
      state-based. Operation-based CRDTs require reliable messaging that
      prevents duplicates. Because this is not an option for our use case, we
      require a state-based CRDT. Also known as a convergent replicated data
      type (CvRDT), a state-based CRDT must merge new data with the local state
      with operations that are <b>idempotent</b> (repeating the same operation
      does not distort the data), <b>commutative</b> (operations can be done in
      any order), and <b>associative</b> (operations can be grouped in any way).
      Restricting operations to meet these criteria ensures that accurate
      replicas can be created for all peers even when messages are duplicated or
      received out of order.</p>
    <h3>Incorporating a CRDT</h3>
    <p>Snake states are represented by a variation of the Grow-only Set (G-set)
      CRDT. Whenever new snake data is received, any TUs newer than existing
      data are simply added to the collection. Changes in direction are made
      whenever the most recent TU in the message is the same or greater than the
      most recent TU in the local data structure.</p>
    <p>So, if the current state of <code>snake 1</code> is…</p>
    <pre>Code here</pre>
    <p>…and we receive the following data from the peer controlling <code>snake
      1</code>…</p>
    <pre>Code here</pre>
    <p>…TUs <code>140</code> and <code>141</code> are added to our state and the
      direction command is changed to ‘up’. The operation here is adding new
      key-value pairs to a JavaScript object, which is idempotent, commutative,
      and associative, meeting all the criteria of a state-based CRDT.</p>
    <p>It is also important to note that states for old TUs will eventually be
      discarded in order to prevent snake states from becoming excessively large
      and unwieldy (high space complexity). This operation does not strictly
      follow the constraints of a CRDT because it could introduce discrepancies
      between peers, but the nature of the game means that data from TUs that
      are more than a few seconds in the past are no longer relevant to gameplay
      and can be safely discarded.</p>

    <h2>Optimizations</h2>
    <h3>Data Structure for Snake Bodies</h3>
    <p>We had three requirements for our snake data structure:</p>
    <ul>
      <li>Fast insertion of new coordinates</li>
      <li>Fast deletion of old coordinates</li>
      <li>Fast lookup by TU for collision checking</li>
    </ul>
    <p>Initially, we implemented snake bodies as queues using arrays. This gave
      us the <code>O(1)</code> insertion and deletion we needed, but we did not
      have a
      correspondence between coordinates and TUs that allowed fast lookup by
      TU.</p>
    <p>Ideally, we wanted to use a linked hash map, which is the combination of
      a hash (key-value pairs) and a doubly-linked list with pointers to the
      head (first) and tail (last) elements that allow you to traverse through
      the hash elements in order. However, linked hash maps are not natively
      implemented in JavaScript, so we implemented an approximation that
      fulfills all our requirements:</p>
    <pre>Code here</pre>
    <p>In the structure above, the <code>byKey</code> object is a hash where TUs
      are the keys
      and coordinate pairs are the values.
      The <code>newest</code> and <code>oldest</code> values are
      simply integers that correspond with
      the <code>newest</code> and <code>oldest</code> TUs contained
      in <code>byKey</code>. The TUs in <code>byKey</code> will be sequential
      and will fall within the
      range defined by <code>newest</code> and <code>oldest</code>, so we can
      use <code>newest</code> and <code>oldest</code> as the
      starting points to iterate through the collection starting at the head
      (<code>newest</code>) or tail (<code>oldest</code>) as in a linked list.
      This structure meets all
      our criteria, giving us <code>O(1)</code> lookup by
      TU, <code>O(1)</code> insertion, and <code>O(1)</code>
      deletion:</p>
    <pre>Code here</pre>
    <h3>Data Structure for the Game Board</h3>
    <p>The game board, which is used for display and for collision checking, was
      initially implemented as a sparse matrix using nested arrays:</p>
    <pre>Code here</pre>
    <p>This provided us <code>O(1)</code> time complexity for lookup. However,
      this structure was not very space efficient because we had to insert many
      <code>undefined</code> values and empty arrays in order to shift data into
      the correct
      indexes.
    </p>
    <p>We improved the space efficiency by switching to a two-dimensional
      hash:</p>
    <pre>Code here</pre>
    <p>The only disadvantage to this structure was that merging such structures
      necessitated a deep merge instead of a more efficient shallow merge. In
      order to convert this two-dimensional object into a one-dimensional
      object, we needed to shift away from using coordinates, like this...</p>
    <table class='coordinates'>
      <thead>
      <tr>
        <th></th>
        <th>0</th>
        <th>1</th>
        <th>2</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>0</th>
        <td>[0][0]</td>
        <td>[0][1]</td>
        <td>[0][2]</td>
      </tr>
      <tr>
        <th>1</th>
        <td>[1][0]</td>
        <td>[1][1]</td>
        <td>[1][2]</td>
      </tr>
      <tr>
        <th>2</th>
        <td>[2][0]</td>
        <td>[2][1]</td>
        <td>[2][2]</td>
      </tr>
      </tbody>
    </table>
    <p>...to using sequential numbers, which are easily converted to and from
      coordinates (<code>squareNumber = row * gridSize + column</code>), like
      this...</p>
    <table class='numbers'>
      <tbody>
      <tr>
        <td>0</td>
        <td>1</td>
        <td>2</td>
      </tr>
      <tr>
        <td>3</td>
        <td>4</td>
        <td>5</td>
      </tr>
      <tr>
        <td>6</td>
        <td>7</td>
        <td>8</td>
      </tr>
      </tbody>
    </table>
    <pre>Code here</pre>
    <p>This structure gave us <code>O(1)</code> lookup by square number and efficient shallow
      merging.</p>
    <h3>Head Sets for Display Boards and Collision Checking</h3>
    <p>In order to display a game board or to check for snake collisions, snake data must be aggregated into boards.  It would be very inefficient to re-aggregate boards from snake data each time a new board was needed, so we implemented an in-between data structure: head sets.</p>
    <p>Each head set is an aggregation of all snake heads for a particular TU.  Because a snake body is actually a set of head positions for a range of TUs, aggregating snake data into boards becomes a matter of aggregating head sets.  In other words, snake data is aggregated into head sets as it is received, and head sets are subsequently aggregated into boards.  Because the head sets are reusable for a range of TUs that increases as snake lengths increase, using them dramatically improves efficiency of aggregating boards for collision checking and display.</p>
    <p>The local snake is not included in the head sets to prevent the local snake from overwriting another snake’s coordinates, which would complicate the detection of collisions.  A board that will be used to check for collisions should include all head sets (all peer snake coordinates) for the relevant TU range, and all of the coordinates for the local snake except for the head.  If the coordinates of the local snake’s head are present in this aggregation (despite the fact that the snake’s actual head was excluded from it), then the local snake’s head has collided with another snake or another part of its own body.</p>
    <p>In the case of a board that will be used for display, we must include the relevant head sets, the entire local snake, and predictions for missing snake data.  Because display boards contain this predicted data, they cannot be treated as authoritative and must be discarded when new data is received.  However, the snake data and head sets are both authoritative data, which is why head sets can be used for collision checking.  Like snake bodies, head sets are also CRDTs, and operations on head sets are idempotent, commutative, and associative to protect their integrity.</p>
    <h3>P2P Network Topology</h3>
    <p>When selecting a P2P network topology, our goal was to minimize the effect of latency as much as possible by eliminating intermediaries between peers.  The topology that best accomplishes this is a fully-connected or full-mesh structure.  In this structure, each peer is connected directly to all other peers with no intermediaries.  This eliminates the need to relay messages, which would compound latency between peers.  Although it requires more effort in the initial setup, once a full-mesh network is in place broadcasting becomes a simple matter of iterating through all connections.  This model has a higher bandwidth overhead because each message is sent individually (no message aggregation), but this is not a concern for the small, text-based messages that are exchanged in Ouroboros.</p>
    <h2>Future Work</h2>
    <h3>Automated Testing for P2P Network</h3>
    <h3>Latency Testing</h3>
    <h3>Migrate to Current Library for WebRTC</h3>
    <h3>Scaling</h3>


  </main>
);

export default About;
