import { GameTimestamps } from '../typings/Timestamps';

const gameTimestamps = {
  pre_game: '2026-04-03T00:00:00-04:00',
  game_start: '2026-04-04T12:00:00-04:00',
  review_start: '2026-04-22T12:00:00-04:00',
  review_end: '2026-04-26T14:00:00-04:00',
  game_end: '2026-05-03T14:00:00-04:00',
}

export const raffleDrawingTimestamp = '2025-04-24T14:00:00-04:00';

// Convert game timestamps into ISO strings
export const isoGameTimestamps: GameTimestamps = Object.entries(gameTimestamps).reduce(
  (acc, [key, timestamp]) => {
    const typedKey = key as keyof GameTimestamps;
    acc[typedKey] = new Date(timestamp).toISOString();
    return acc;
  },
  {} as GameTimestamps
);