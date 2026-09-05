import dotenv from 'dotenv';
import Business from '../models/business';
import ChestModel from '../models/chest';
import MultipleChoiceModel from '../models/multipleChoice';
import connectDB from '../db/db';
import RaffleItemModel from '../models/raffleItem';
import { randomUUID } from 'node:crypto';

dotenv.config();

const fixRaffleItems = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const items = await RaffleItemModel.find();
    for (const item of items) {
      item.item_id = randomUUID();
    }

    RaffleItemModel.bulkSave(items);

    console.log('UUID inserted into raffle items successfully.');
  } catch (err) {
    console.error('Error creating chests:', err);
  } finally {
    console.log('raffle items process completed.');
    dbConnection?.close();
  }
}

fixRaffleItems();