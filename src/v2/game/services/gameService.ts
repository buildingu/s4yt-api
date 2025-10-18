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
import { UpdateStakedCoins, RaffleWinners, RaffleItemDTO } from "../../typings/RaffleItem";
import { socketEmit } from "../../utils/socket-emitter";

export const getRaffleItemsTransformed = async (userId: string | undefined) : Promise<RaffleItemDTO[]> => {
  try {
    if (!userId) {
      throw new HttpError('User not found', 404);
    };

    const raffleItems = await RaffleItem.find({})
      .populate({
        path: 'raffle_partner',
        select: '-_id -__v -deleted -description',
      })
      .lean();

      return raffleItems.map(item => {
        const userEntry = item.entries?.find(entry => 
          entry.user.toString() === userId
        );
      
        const anyCoinsStaked = item.entries?.some(entry => entry.coins > 0);
      
        return {
          item_id: item.item_id,
          raffle_partner: item.raffle_partner,
          name: item.name,
          description: item.description,
          image_src: item.image_src,
          stock: item.stock,
          coins: userEntry ? userEntry.coins : 0,
          silver: !anyCoinsStaked,
        };
      });
            
    
  } catch (error: any) {
    throw new Error(`Error retrieving transformed raffle items: ${error.message}`);
  }
};

export const updateStakedCoins = async (raffle: Array<UpdateStakedCoins>, userId: string | undefined, totalCoins: number) => {
  try {

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    user.coins = totalCoins;
    await user.save();

    const goldSilverUpdates = [];

    for (const stake of raffle) { 
      const { item_id, coins } = stake;
      if (!item_id) {
        continue;
      }

      const raffleItem = await RaffleItem.findOne({ item_id });

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
      total_coins: totalCoins,
    };
  } catch (error: any) {
    throw resolveErrorHandler(error);
  }
}

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

    const { chest_id } = payload;

    // Check if chest has already been submitted, to prevent potential abuse
    if (user.chests_submitted.has(chest_id)) {
      throw new HttpError('Chest has already been submitted', 409);
    }

    user.chests_submitted.set(chest_id, count);

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
         select: '-_id -__v -business_id'
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
      throw new HttpError('Challenge not found.', 404);
    }

    const user = await User.exists({ _id: userId });
    if (!user) {
      throw new HttpError('User not found.', 404);
    }

    if (!submissionLink) {
      throw new HttpError('Submission link is required.', 400);
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
      throw new HttpError('User not found.', 404);
    }

    return updatedUser;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

// RETURN RAFFLE WINNERS
export const getRaffleWinners = async (): Promise<RaffleWinners[] | null> => {
  try {
    const raffleItems = await RaffleItem.find({}, "image_src winners")
      .populate("raffle_partner", "name logo")
      .lean();

    const results = await Promise.all(raffleItems.map(async (item): Promise<RaffleWinners | null> => {
      if (!item.winners || item.winners.length === 0) {
        return null;
      }
      const partner = item.raffle_partner as {name?: string; logo?: string}
      return {
        partner_name: partner.name,
        image_src: item.image_src,
        logo: partner?.logo,
        winners: await UserModel.find({ "_id": { $in: item.winners } }, 'name education region country -_id').lean()
      };
    }))

    return results.filter((result): result is RaffleWinners => result !== null);

  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

const getChallengeWinners = async (): Promise<BusinessChallengeWinners[]> => {
  try {
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

    return businesses.map(business => {
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
  } catch (error) {
    throw resolveErrorHandler(error);
  }
}

export const getEventResults = async () => {
  try {
    const challengeWinners = await getChallengeWinners();
    const raffleWinners = await getRaffleWinners();

    return {
      raffle_winners: raffleWinners,
      challenge_winners: challengeWinners
    }
  } catch (error) {
    throw resolveErrorHandler(error);
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