import { Timestamps } from '../typings/Timestamps';

const timestamps = {
  register_start: '2025-1-1',
  game_start: '2025-1-7',
  review_start: '2025-1-10',
  review_end: '2025-1-11',
  game_end: '2025-1-12',
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