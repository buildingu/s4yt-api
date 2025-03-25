import mongoose, { Types } from 'mongoose';

export interface RaffleItem {
  item_id: string;
  raffle_partner: Types.ObjectId;
  name: string;
  description: string;
  image_src: string;
  stock: number;
  entries: [{ // TODO: derive total coins, silver/gold status from entries in response  
    user: Types.ObjectId;
    coins: number;
  }],
  winners: Types.ObjectId[];
}

export interface UpdateStakedCoins {
  item_id: string;
  coins: number;
}

export interface RaffleItemWinner {
  raffleItemId: mongoose.Types.ObjectId;
  winnerUserId: mongoose.Types.ObjectId;
}