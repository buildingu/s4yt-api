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
import { socketEmit } from "../../utils/socket-emitter";

export const getRaffleItems = async () => {
  try {
    const raffleItems = await RaffleItem.find({});
    return raffleItems;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle items: ${error.message}`);
  }
};

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

    // event: business_challenge_submitted
    // Send me: { challenge_id, answers_count }
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