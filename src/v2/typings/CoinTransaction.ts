export const coinSources = [
  'register',
  'invitedNewUser',
  "invitedByExistingUser",
  'chest'
] as const;

export interface CoinTransaction {
  source: typeof coinSources[number];
  count: number;
};