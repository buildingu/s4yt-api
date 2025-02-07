import RaffleItemModel from '../../models/raffleItem';
import { RaffleWinnerModel } from '../../models/raffleWinner';
import mongoose from 'mongoose';

interface Stake {
  user: mongoose.Types.ObjectId;
  coin_staked: number;
}

interface Chance extends Stake {
  chance: number;
}

const calculateChances = (stakes: Stake[]): Chance[] => {
  const totalStakes = stakes.reduce((acc, stake) => acc + stake.coin_staked, 0);
  return stakes.map(stake => ({
    ...stake,
    chance: stake.coin_staked / totalStakes,
  }));
};

const selectWinners = async (): Promise<void> => {
  const raffleItems = await RaffleItemModel.find({}).populate('stakes.user');

  for (const raffleItem of raffleItems) {
    const stakes = raffleItem.stake as Stake[];
    const chances = calculateChances(stakes);
    chances.sort((a, b) => b.chance - a.chance);

    let cumulativeChance = 0;
    const randomValue = Math.random();

    for (const chance of chances) {
      cumulativeChance += chance.chance;
      if (randomValue <= cumulativeChance) {
        const raffleWinner = new RaffleWinnerModel({
          raffleItem: raffleItem._id,
          user: chance.user,
        });
        await raffleWinner.save();
        break;
      }
    }
  }
};

export const RaffleService = {
  selectWinners,
};