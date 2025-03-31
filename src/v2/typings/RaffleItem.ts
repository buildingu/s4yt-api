import { Types } from 'mongoose';

export interface RaffleItem {
  item_id: string;
  raffle_partner: Types.ObjectId;
  name: string;
  description: string;
  image_src: string;
  stock: number;
  entries: [{
    user: Types.ObjectId;
    coins: number;
  }],
  winners: Types.ObjectId[];
}

export interface UpdateStakedCoins {
  raffle_item_id: string;
  coins: number;
}