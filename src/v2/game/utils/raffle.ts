import RaffleItemModel from '../../models/raffleItem';
import { RaffleItemWinner } from '../../typings/RaffleItem';

export const selectRaffleWinners = async (): Promise<RaffleItemWinner[]> => {
  try { 
    const raffleItems = await RaffleItemModel.find({});

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