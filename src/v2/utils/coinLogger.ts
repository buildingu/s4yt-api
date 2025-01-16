import { CoinTransaction } from "../typings/CoinTransaction"
import { HydratedDocument } from "mongoose";
import User from "../typings/User";

// Adds a coin transaction to a User's coin_transactions list
export const trackCoins = async (user: HydratedDocument<User>, count: number, source: string) => {
  try {
    const coinsGained: CoinTransaction = {
      source,
      count,
    };

    user.coin_transactions.push(coinsGained);
    await user.save();

    return {
      success: true,
      message: 'ok',
    }
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      message: err.message,
    }
  }
}