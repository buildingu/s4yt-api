import { CoinTransaction, coinSources } from "../typings/CoinTransaction"
import { HydratedDocument } from "mongoose";
import User from "../typings/User";
import { socketEmit } from "./socket-emitter";

// Adds coins to user's balance given a legitimate source and adds it to their coin history
// NOTE: `await user.save()` must be called after calling this function, since it doesn't update the user's data to the db itself
export const awardCoinsToUser = (
  user: HydratedDocument<User>,
  count: number,
  source: typeof coinSources[number],
  sendEvent: boolean
) => {
  user.coins += count;
  trackCoins(user, count, source);

  if (sendEvent) {
    socketEmit.send({
      target: user.email,
      event: 'coin_change',
      data: {
        coins: count
      }
    });
  }
}

// Adds a coin transaction to a User's coin_transactions list
const trackCoins = async (user: HydratedDocument<User>, count: number, source: typeof coinSources[number]) => {
  const coinsGained: CoinTransaction = {
    source,
    count,
  };

  user.coin_transactions.push(coinsGained);
}