import schedule from 'node-schedule';
import { raffleDrawingTimestamp } from '../configs/timestamps';
import { selectRaffleWinners } from '../game/utils/raffle';
import { logger } from './logger';

export const scheduleRaffleDrawing = () => {
  const date = new Date(raffleDrawingTimestamp);
  if (date.getTime() < Date.now()) {
    console.log(`WARNING: Raffle drawing is scheduled for a time in the past (${date.toLocaleString()}). Drawing will not be scheduled.`);
    return null;
  }

  console.log(`Raffle drawing will be scheduled for: ${date.toLocaleString()}`);

  return schedule.scheduleJob(date, async () => {
    try {
      console.log('Running raffle drawing now...');
      const results = await selectRaffleWinners();
      console.log('Raffle drawing complete:');
      console.log(results);
    } catch (error: unknown) {
      const err = error as Error;

      console.log('ERROR running raffle drawing');
      console.log(err.message);
      logger.error(err.stack || err);
    }
  });
}