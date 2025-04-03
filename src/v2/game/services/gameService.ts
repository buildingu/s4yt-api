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
import { UpdateStakedCoins, RaffleItemWinner, RaffleWinners, Winner } from "../../typings/RaffleItem";
import { socketEmit } from "../../utils/socket-emitter";

export const getRaffleItemsTransformed = async (userId: string | undefined) => {
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

export const updateStakedCoins = async (raffle: Array<UpdateStakedCoins>, userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error(`User not found`);
    }

    const goldSilverUpdates = [];

    for (const stake of raffle) { 
      const { item_id, coins } = stake;
      if (!item_id) {
        continue;
      }

    
      const raffleItem = await RaffleItem.findById(item_id);

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

export const selectRaffleWinners = async (): Promise<RaffleItemWinner[]> => {
  try { 
    const raffleItems = await RaffleItem.find({});

    // Keep track of user ids that have already won
    const usedUserIds = new Set<string>();

    const winners = raffleItems.map( async (item): Promise<RaffleItemWinner[] | null> => {
      const itemWinners: RaffleItemWinner[] = [];

      for (let i=0; i < item.stock; i++) {
        // Filter out entries that already won
        let eligibleEntries = item.entries.filter(entry => !usedUserIds.has(entry.user.toString()));

        // If there are no eligible entries, break off
        if (eligibleEntries.length === 0) {
          break;
        };

        // If there are still no entries, return null
        const totalStakes = eligibleEntries.reduce((acc, entry) => acc + entry.coins, 0);
        if (totalStakes === 0) break;

        // Generate the random number
        let randomPoint = Math.random() * totalStakes;

        // System to select
        for (const entry of eligibleEntries) {
          randomPoint -= entry.coins;
          if (randomPoint <= 0) {
            usedUserIds.add(entry.user.toString()); 

            const winner: RaffleItemWinner = {
              raffleItemId: item._id,
              winnerUserId: entry.user
            };

            item?.winners.push(entry.user);
            itemWinners.push(winner);
            
            break;
          }
        }
      }


      return itemWinners.length > 0 ? itemWinners : null;
    })
    
    // wait for all to finish
    const awaitedWinners = await Promise.all(winners);

    // filter nulls
    const finalWinners = awaitedWinners.filter((winner): winner is RaffleItemWinner[] => winner !== null);
    
    // save all
    await Promise.all(raffleItems.map(item => {
      item.save()
    }));

    return finalWinners.flat().filter((winner): winner is RaffleItemWinner => winner !== null);
  } catch (error: any) {
    throw new Error(`Error determining raffle winners: ${error.message}`);
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

  } catch (error: any) {
    throw new Error(`Error fetching raffle winners: ${error.message}`);
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