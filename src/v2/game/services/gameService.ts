import Business from "../../models/business";
import Question from "../../models/question";
import RaffleItem from "../../models/raffleItem";
import { RafflePartner, RafflePartnerModel } from "../../models/rafflePartner";
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

export const getRaffleItemsService = async () => {
  try {
    const raffleItems = await RaffleItem.find({});
    
    return raffleItems;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle items: ${error.message}`);
  }
};

// TODO: The gold and sliver coins is going to be a socket, you emit to me and I'll be listen to sliver and gold coin changes.
export const getRaffleIndicatorCoinsService = async () => {
  try {
    const raffleItems = await RaffleItem.find().populate('stake.user');
    const indicators = raffleItems.map(item => ({
      itemId: item._id,
      // FIXME
      //goldCoin: item.stake.some(stake => stake.coin_staked > 0),
      //silverCoin: item.stake.every(stake => stake.coin_staked === 0)
    }));
    return indicators;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle coin indicators: ${error.message}`);
  }
};


export const getRaffleWinnersService = async (): Promise<Array<{ raffleItemId: mongoose.Types.ObjectId, winnerUserId: mongoose.Types.ObjectId }>> => {
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

export const createRafflePartner = async (rafflePartnerData: RafflePartner)=>{
  try {
    const newPartner = new RafflePartnerModel(rafflePartnerData);
    await newPartner.save();
    return newPartner;
  } catch(error) {
    throw resolveErrorHandler(error, [
      {
        errorName: 'ValidationError',
        errorMessage: 'Missing or incorrect parameters.',
        httpStatusCode: 400
      }
    ]);
  }
}

export const editRafflePartner = async (id: string, updatedData: Partial<RafflePartner>) => {
  try {
    const updatedPartner = await RafflePartnerModel.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true,
    });
    if (!updatedPartner) {
      throw new HttpError('Raffle partner not found.', 404);
    }
    return updatedPartner;
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

    await awardCoinsToUser(user, count, source, true);
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
  try {
    const allBus = await Business.find({}, '-_v -admin_business_id -challenge -chests -winners', { lean: true });
    if (!allBus) {
      throw new Error('Businesses not found');
    }

    // Count the number of submitted answers to all business questions
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

export const saveAnswer = async (questionId: string, userId: string, text: string, submit: boolean = false) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const { business } = question;
  if (!business) {
    throw new Error('Question is not associated with any Business');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!text) {
    throw new Error('Answer text is required');
  }

  const answer = new Answer({
    question,
    business,
    user,
    text,
    status: submit ? 'Submitted' : 'Draft'
  });

  await answer.save();

  const responseObj = {
    _id: answer.id,
    question: question.id,
    business,
    user: user._id,
    text,
    status: answer.status
  }

  return responseObj;
} 

export const updateAnswer = async (answerId: string, text: string, submit: boolean = false) => {
  const updateData = {
    text,
    ...(submit && { status: 'Submitted'})
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
      const questions = business.questions;

      for (const questionId of questions) {
        const question = await Question.findById(questionId);

        if (!question) continue;

        for (const prize of question.prize_allocation) {
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

// Don't call this TreasureMap the TreasureMap is actually the main page that shows all the links to go to the raffle, learn and earn, or where ever (home). (I know I think this is old).
export const getTreasureMapData = async (userId: Types.ObjectId) => {
  try {
    // Fetch user details to determine which elements to show on the treasure map
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Fetch raffle items and information
    const raffleItems = await RaffleItem.find({ active: true });
    const raffleData = raffleItems.map(item => ({
      id: item.id,
      // FIXME
      //name: item.name_raffle_item,
      //image: item.image,
      //quantity: item.qty
    }));

    // FIXME
    /*const sponsors = await Sponsor.find({});
    const sponsorData = sponsors.map(sponsor => ({
      id: sponsor.id,
      name: sponsor.name,
      logo: sponsor.logo_path, 
    }));*/

    const treasureMapData = {
      user: {
        name: user.name,
        coins: user.coins, 
      },
      raffle: raffleData,
      // FIXME
      //sponsors: sponsorData,
    };

    return treasureMapData;
  } catch (error: any) {
    throw new Error(`Error retrieving treasure map data: ${error.message}`);
  }
};

