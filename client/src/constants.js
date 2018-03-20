export const GRID_SIZE = 40;

export const LOOP_INTERVAL = 250;
export const INITIAL_TU = 0;

// number of TUs retained for snakes and boards
// beyond what is currently displayed (according to snake length)
export const HISTORY_LENGTH = 10;
export const NUMBER_CANDIDATE_TUS = 3;
export const COLLISION_TYPE_HEAD_ON_HEAD = 'HEAD_ON_HEAD';
export const COLLISION_TYPE_HEAD_ON_BODY = 'HEAD_ON_BODY';
export const COLLISION_TYPE_HEAD_ON_TAIL = 'HEAD_ON_TAIL';

export const GAME_RESULT_TIE = 'TIE';

export const INITIAL_SNAKE_LENGTH = 4;
export const SNAKE_STATUS_ALIVE = 'alive';
export const SNAKE_STATUS_DEAD = 'dead';

export const GAME_STATUS_LOBBY = 'lobby'; // peer connections
export const GAME_STATUS_PREGAME = 'pregame'; // no new peers, share initial positions
export const GAME_STATUS_READY_TO_PLAY = 'ready'; // all initial positions received
export const GAME_STATUS_PLAYING = 'playing';
export const GAME_STATUS_POSTGAME = 'postgame'; // show winner, play again?
