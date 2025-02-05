import { Types } from "mongoose";

export interface Stake {
  user: Types.ObjectId;
  coins: number;
}

export interface RaffleItem {
  item_id: string;
  name: string;
  description: string;
  image_src: string;
  stock: number;
  raffle_partner: {
    logo_url: string;
    organization_name: string;
    resource_link: string;
    education_category: string;
  };

  entries: Stake[];
  // TODO: derive total coins, silver/gold status from entries in response  
}