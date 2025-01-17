import { CoinTransaction } from "../typings/CoinTransaction"
import { HydratedDocument } from "mongoose";
import User from "../typings/User";

// Adds a coin transaction to a User's coin_transactions list
export const trackCoins = async (user: HydratedDocument<User>, count: number, source: string, save: boolean = true) => {
  const coinsGained: CoinTransaction = {
    source,
    count,
  };

  user.coin_transactions.push(coinsGained);
  if (save) {
    await user.save();
  }
}