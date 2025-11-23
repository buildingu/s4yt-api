// All timestamps must be ISO strings (Date.prototype.toISOString)

export interface GameTimestamps {
  pre_game: string;
  game_start: string,
  review_start: string,
  review_end: string,
  game_end: string
};