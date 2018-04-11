export const GRID_SIZE = 40;
export const LOOP_INTERVAL = 250;
export const INITIAL_TU = 0;

// number of TUs retained for snakes and boards
// beyond what is currently displayed (according to snake length)
export const HISTORY_LENGTH = 10;

// number of snake TUs to send to peers
export const P2P_TUS = 5;

// how far back in TUs to look for collisions
export const NUMBER_CANDIDATE_TUS = 3;

// peer killed for excessive latency or disconnection has tuOfDeath of 0
export const LATENCY = 0;
export const DISCONNECTION = 0;

export const GAME_OVER_DELAY = 10;

export const INITIAL_SNAKE_LENGTH = 4;

// a player that is further behind in TUs than this number will be given
// GAME_STATUS_OUT_OF_SYNC and their snake will die automatically
export const LATENT_SNAKE_TOLERANCE = GAME_OVER_DELAY;

export const GAME_STATUS_LOBBY = 'lobby'; // peer connections
export const GAME_STATUS_PREGAME = 'pregame'; // no new peers, share initial positions
export const GAME_STATUS_READY_TO_PLAY = 'ready'; // all initial positions received
export const GAME_STATUS_PLAYING = 'playing';
export const GAME_STATUS_POSTGAME = 'postgame'; // show winner, play again?
export const GAME_STATUS_OUT_OF_SYNC = 'out of sync';
