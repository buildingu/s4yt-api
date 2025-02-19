import { Timestamps } from '../typings/Timestamps';

const timestamps = {
  pre_game: '2025-04-18T01:00:00-05:00',
  game_start: '2025-04-19T12:00:00-05:00',
  review_start: '2025-04-22T12:00:00-05:00',
  review_end: '2025-04-26T14:00:00-05:00',
  game_end: '2025-05-03T14:00:00-05:00',
}

// Convert timestamps into ISO strings
export const isoTimestamps: Timestamps = Object.entries(timestamps).reduce(
  (acc, [key, timestamp]) => {
    const typedKey = key as keyof Timestamps;
    acc[typedKey] = new Date(timestamp).toISOString();
    return acc;
  },
  {} as Timestamps
);