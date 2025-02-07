import { Timestamps } from '../typings/Timestamps';

// TODO: move to db
const timestamps = {
  game_start: '2025-03-01',
  review_start: '2025-03-03',
  review_end: '2025-03-05',
  game_end: '2025-03-07',
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