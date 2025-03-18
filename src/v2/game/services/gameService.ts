import Business from "../../models/business";
import Challenge from "../../models/challenge";
import RaffleItem from "../../models/raffleItem";
import { RafflePartner } from "../../typings/RafflePartner";
import { RafflePartnerModel } from "../../models/rafflePartner";
import mongoose from "mongoose";
import User from "../../models/user";
import { Types } from "mongoose";
import Answer from "../../models/answer";
import { HttpError, resolveErrorHandler } from "../../middleware/errorHandler";
import UserModel from "../../models/user";
import { CoinTransaction, coinSources } from "../../typings/CoinTransaction";
import { awardCoinsToUser } from "../../utils/coins";
import ChestModel from "../../models/chest";

// FIXME: Fix raffle related services to conform to new RaffleSchema

export const getRaffleItems = async () => {
  try {
    const raffleItems = await RaffleItem.find({});
    
/*
  item_id
  raffle_partner - this needs to be populated
  name
  description
  image_src
  stock
  entries - see if the current user is among the entries in the array, if so, send back the number of coin they staked, otherwise, send the number 0 back
  isSilver - if entries is empty, then this is "true", otherwise it's "false"
*/

    return raffleItems;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle items: ${error.message}`);
  }
};

// TODO: The gold and sliver coins is going to be a socket, you emit to me and I'll be listen to silver and gold coin changes.
// { item_id: string, isSilver: bool }
/*export const getRaffleIndicatorCoins = async () => {
  try {
    const raffleItems = await RaffleItem.find().populate('stake.user');
    const indicators = raffleItems.map(item => ({
      itemId: item._id,
      //goldCoin: item.stake.some(stake => stake.coin_staked > 0),
      //silverCoin: item.stake.every(stake => stake.coin_staked === 0)
    }));
    return indicators;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle coin indicators: ${error.message}`);
  }
};*/

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

export const getAllRafflePartners = async () => {
  try {
    const partners = await RafflePartnerModel.find();
    return partners;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const getRafflePartner = async (id: string) => {
  try {
    const partner = await RafflePartnerModel.findById(id)
    if (!partner) {
      throw new HttpError('Raffle partner not found.', 404);
    }
    return partner;
  } catch (error) {
    throw resolveErrorHandler(error, [
      {
        errorName: 'CastError',
        errorMessage: 'Raffle partner not found.',
        httpStatusCode: 404
      }
    ]);
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

    const user = await User.exists({ _id: userId }); // TODO: You should be using .exists when doing this because findOne is more expensive and gives you the entire document for no reason.
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

export const sendBusinessChallengeWinners = async () => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "sendBusinessChallengeWinners service error; getting business challenge winners:\n" +
        error.message
    );
  }
};

  export const getEventResults = async () => {
    const allBus = await Business.find({});
    if (!allBus) {
      throw new Error('Businesses not found');
    }

    // FIXME
    /*let results = [];
    for (const business of allBus) {
      let businessResults = [];
      const challenges = business.challenges;

      for (const challengeId of challenges) {
        const challenge = await Challenge.findById(challengeId);

        if (!challenge) continue;

        for (const prize of challenge.prize_allocation) {
          const user = await User.findById(prize.winner);
          if (!user) continue;

          let award = {
            place: prize.place,
            amount: prize.amount,
            winner_name: user.name,
            winner_region: user.region,
            winner_country: user.country,
          };
          businessResults.push(award);
        }
        
      }
      
      results.push(businessResults)
    }
    return results;*/
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