import Business from "../../models/business";
import Challenge from "../../models/challenge";
import RaffleItem from "../../models/raffleItem";
import { RafflePartnerModel } from "../../models/rafflePartner";
import mongoose from "mongoose";
import User from "../../models/user";
import Answer from "../../models/answer";
import { HttpError, resolveErrorHandler } from "../../middleware/errorHandler";
import UserModel from "../../models/user";
import { CoinTransaction, coinSources } from "../../typings/CoinTransaction";
import { awardCoinsToUser } from "../../utils/coins";
import ChestModel from "../../models/chest";
import { UpdateStakedCoins } from "../../typings/RaffleItem";
import { socketEmit } from "../../utils/socket-emitter";

// FIXME: Fix raffle related services to conform to new RaffleSchema

export const getRaffleItems = async () => {
  try {
    const raffleItems = await RaffleItem.find({});
    return raffleItems;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle items: ${error.message}`);
  }
};

// interface UserEntry {
//   user: mongoose.Types.ObjectId | string;
//   coins: number;
// }

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
        raffle_item_id: raffleItem.item_id,
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

export const sendBusinessesInfo = async () => {
  // FIXME: This is old code, needs to be checked and maybe updated
  try {
    const allBus = await Business.find({}, '-_v -admin_business_id -challenge -chests -winners', { lean: true });
    if (!allBus) {
      throw new Error('Businesses not found');
    }

    // Count the number of submitted answers to all business challenges
    const results = [];
    for (const business of allBus) {
      const numAnswers = await Answer.countDocuments({ business: business._id, status: 'Submitted'});

      const busInfo = {
        ...business,
        numAnswers
      };

      results.push(busInfo);
    }
  
    return results;
  } catch (error: any) {
    throw new Error(
      "sendBusinessesInfo service error; getting businesses info:\n" +
        error.message
    );
  }
};

export const saveAnswer = async (challengeId: string, userId: string, text: string) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }

  const { business } = challenge;
  if (!business) {
    throw new Error('Challenge is not associated with any Business');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!text) {
    throw new Error('Answer text is required');
  }

  const answer = new Answer({
    challenge,
    business,
    user,
    text
  });

  await answer.save();

  const responseObj = {
    _id: answer.id,
    challenge: challenge.id,
    business,
    user: user._id,
    text
  }

  return responseObj;
} 

export const updateAnswer = async (answerId: string, text: string) => {
  const updateData = {
    text
  };

  const answer = await Answer.findByIdAndUpdate(answerId, updateData, { new: true });
  if (!answer) {
    throw new Error('Answer not found');
  }

  const responseObj = {
    ...answer.toObject(),
    __v: undefined
  }

  return responseObj;
}
  
export const addMeetUp = async (businessId: string, userId: string, rsvpType: string) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (rsvpType === 'Confirm') {
      // TODO: "user" is giving an Error
      //business.meetMembersConfirmed.push(user);
      await business.save();
    }

    return null;
  } catch (error: any) {
    throw new Error(
      "addMeetUp service error; adding meetup answer to the user:\n" +
        error.message
    );
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