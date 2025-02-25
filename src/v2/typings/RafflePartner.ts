export const resourceCategory = [
  'programs',
  'opportunities',
  'contests'
] as const;

export interface RafflePartner {
  name: string;
  description: string;
  logo: string;
  resource_name: string,
  resource_link: string;
  resource_category: typeof resourceCategory[number];
  deleted: boolean;
}
