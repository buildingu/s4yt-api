import Business from "../../models/business";
import Challenge from "../../models/challenge";
import RaffleItem from "../../models/raffleItem";
import mongoose from "mongoose";
import User from "../../models/user";
import Answer from "../../models/answer";
import { HttpError, resolveErrorHandler } from "../../middleware/errorHandler";
import UserModel from "../../models/user";
import { CoinTransaction, coinSources } from "../../typings/CoinTransaction";
import { awardCoinsToUser } from "../../utils/coins";
import ChestModel from "../../models/chest";
import { BusinessChallengeWinners } from "../../typings/Challenge";
import { UpdateStakedCoins } from "../../typings/RaffleItem";
import { socketEmit } from "../../utils/socket-emitter";

export const getRaffleItemsTransformed = async (userId: string | undefined) => {
  try {
    if (!userId) {
      throw new HttpError('User not found', 404);
    };

    const raffleItems = await RaffleItem.find({})
      .populate({
        path: 'raffle_partner',
        select: '-_id -__v',
      })
      .lean();

    return raffleItems.map(item => {
      const userEntry = item.entries?.find(entry => 
        entry.user.toString() === userId
      );

      return {
        item_id: item.item_id,
        raffle_partner: item.raffle_partner,
        name: item.name,
        description: item.description,
        image_src: item.image_src,
        stock: item.stock,
        coins: userEntry ? userEntry?.coins : 0,
        silver: userEntry?.coins === 0 ? true : false,
      };
    });
  } catch (error) {
    throw resolveErrorHandler(error); //new Error(`Error retrieving transformed raffle items: ${error.message}`);
  }
};

export const updateStakedCoins = async (raffle: Array<UpdateStakedCoins>, userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error(`User not found`);
    }

    const goldSilverUpdates = [];

    for (const stake of raffle) { 
      const { raffle_item_id, coins } = stake;
      if (!raffle_item_id) {
        continue;
      }

      const raffleItem = await RaffleItem.findById(raffle_item_id);

      if (!raffleItem) {
        continue;
      }

      const entryIndex = raffleItem.entries.findIndex(
        entry => entry.user.toString() === userId
      );

      if (entryIndex !== -1) {
        raffleItem.entries[entryIndex].coins = coins;
      } else {
        raffleItem?.entries.push({
          user: new mongoose.Types.ObjectId(userId),
          coins: coins
        });
      }

      await raffleItem.save();

      // Record updated gold/silver state of raffle item
      goldSilverUpdates.push({
        item_id: raffleItem.item_id,
        silver: raffleItem.entries.reduce((total, entry) => total + entry.coins, 0) === 0
      });
    }

    socketEmit.send({
      target: 'all',
      event: 'raffle_gold_silver',
      data: goldSilverUpdates
    });

    return {
      message: 'Coins updated successfully.',
    };
  } catch (error: any) {
    throw new Error(`Error updating staked coins: ${error.message}`);
  }
}

export const getRaffleWinners = async (): Promise<Array<{ raffleItemId: mongoose.Types.ObjectId, winnerUserId: mongoose.Types.ObjectId }>> => {
  try {
    const raffleItems = await RaffleItem.find({});

    const winners = raffleItems.map((item): { raffleItemId: mongoose.Types.ObjectId; winnerUserId: mongoose.Types.ObjectId } | null => {
      // FIXME
      //const totalStakes = item.stake.reduce((acc, stake) => acc + stake.coin_staked, 0);
      //let randomPoint = Math.random() * totalStakes;
      /*for (const stake of item.stake) {
        randomPoint -= stake.coin_staked;
        if (randomPoint <= 0) {
          return { raffleItemId: item._id, winnerUserId: stake.user };
        }
      }*/
      return null;
    }).filter((winner): winner is { raffleItemId: mongoose.Types.ObjectId; winnerUserId: mongoose.Types.ObjectId } => winner !== null);

    return winners;
  } catch (error: any) {
    throw new Error(`Error determining raffle winners: ${error.message}`);
  }
};

export const assignCoinsToUser = async (
  userId: string,
  count: number,
  source: typeof coinSources[number],
  payload: Record<string, any>
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const { chestId } = payload;

    // Check if chest has already been submitted, to prevent potential abuse
    if (user.chests_submitted.has(chestId)) {
      throw new HttpError('Chest has already been submitted', 409);
    }

    user.chests_submitted.set(chestId, count);

    awardCoinsToUser(user, count, source, true);
    await user.save();

    return user;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const getChests = async () => {
  try {
    const chests = await ChestModel.find({}, '-_id -__v')
      .populate({
         path: 'group',
         select: '-_id -__v'
      });
    return chests;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
}

export const saveAnswer = async (challengeId: string, userId: string, submissionLink: string) => {
  try {
    const challenge = await Challenge.exists({ _id: challengeId });
    if (!challenge) {
      throw new HttpError('Challenge not found', 404);
    }

    const user = await User.exists({ _id: userId });
    if (!user) {
      throw new HttpError('User not found', 404);
    }

    if (!submissionLink) {
      throw new HttpError('Submission link is required', 400);
    }

    await Answer.updateOne(
      { challenge_id: challengeId, user: userId },
      { submission_link: submissionLink },
      { upsert: true }
    );

    const answerCount = await Answer.countDocuments({ challenge_id: challengeId });

    socketEmit.send({
      target: 'all',
      event: 'business_challenge_submitted',
      data: {
        challenge_id: challengeId,
        answers_count: answerCount
      }
    });
  } catch (error) {
    throw resolveErrorHandler(error);
  }
}
  
export const rsvpMeetUp = async (userId: string, attendMeeting: boolean) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { attend_meeting: attendMeeting },
      { new: true, lean: true, projection: '-_id attend_meeting' }
    );
    if (!updatedUser) {
      throw new HttpError('User not found', 404);
    }

    return updatedUser;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const getEventResults = async () => { 
  // Get Business Challenge results
  const businesses = await Business.find({}, 'name logo winners')
    .lean()
    .populate({
      path: 'winners',
      populate: {
        path: 'user_id',
        model: 'User',
        select: '-_id name education region country',
      },
    });

  const challengeWinners: BusinessChallengeWinners[] = businesses.map(business => {
    const winners = business.winners.map(winner => {
      const user = winner.user_id;
      return {
        award: winner.award,
        name: user.name,
        education: user.education,
        region: user.region,
        country: user.country,
      }
    });
    
    return {
      business_name: business.name,
      logo: business.logo,
      winners
    };
  });
  
  return {
    challenge_winners: challengeWinners
  }
};

export const getCoinsGainedHistory = async (userId: string): Promise<CoinTransaction[]> => {
  try {
    const user = await UserModel.findById(userId, 'coin_transactions');
    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return user.coin_transactions;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const getCoinsTotal = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId, '-_id coins');
    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return user;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};