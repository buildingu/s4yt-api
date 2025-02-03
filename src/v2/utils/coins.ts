import { CoinTransaction, coinSources } from "../typings/CoinTransaction"
import { HydratedDocument } from "mongoose";
import User from "../typings/User";

// Adds coins to user's balance given a legitimate source and adds it to their coin history
// NOTE: `await user.save()` must be called after calling this function, since it doesn't update the user's data to the db itself
export const awardCoinsToUser = async (
  user: HydratedDocument<User>,
  count: number,
  source: typeof coinSources[number],
  payload: Record<string, any>
) => {
  // Handle source-specific side effects
  switch (source) {
    case 'chest':
      // Add coin amount and its chest source to user's chests_submitted list
      const { chestId } = payload;

      if (!chestId) {
        return {
          success: false,
          message: 'Invalid chest id',
          statusCode: 400
        };
      }

      // Check if chest has already been submitted, to prevent potential abuse
      if (user.chests_submitted.has(chestId)) {
        return {
          success: true,
          message: 'Chest has already been submitted',
          statusCode: 200
        };
      }

      user.chests_submitted.set(chestId, true);
      break;

    case 'referral':
      // Update the inviting user's accepted_referrals list
      const { acceptedReferralId } = payload;
      if (!acceptedReferralId) {
        return {
          success: false,
          message: 'Invalid accepted referral user id',
          statusCode: 400
        };
      }

      user.accepted_referrals.push(acceptedReferralId);
      break;

    case 'register':
      // No additional side effects
      break;

    default:
      // Typescript should prevent this from happening
      return {
        success: false,
        message: 'Invalid coin source type',
        statusCode: 400
      };
  }

  // Add coins to user and track
  console.log('e');
  user.coins += count;
  trackCoins(user, count, source);

  console.log('f');
  return {
    success: true,
    message: 'OK',
    statusCode: 200
  };
}

// Adds a coin transaction to a User's coin_transactions list
const trackCoins = async (user: HydratedDocument<User>, count: number, source: typeof coinSources[number]) => {
  const coinsGained: CoinTransaction = {
    source,
    count,
  };

  user.coin_transactions.push(coinsGained);
}