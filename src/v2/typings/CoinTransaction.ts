export const coinSources = [
  'register',
  'referral',
  'chest'
] as const;

export interface CoinTransaction {
  source: typeof coinSources[number];
  count: number;
};