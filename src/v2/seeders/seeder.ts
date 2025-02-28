import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import { RafflePartnerModel } from '../models/rafflePartner.js';
import RaffleItemModel from '../models/raffleItem.js';
import connectDB from '../db/db.js';
import UserModel from '../models/user.js';

dotenv.config();

const seedDatabase = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load seed data
    const rafflePartnerFilePath = path.join(__dirname, 'rafflePartners.json');
    const raffleItemFilePath = path.join(__dirname, 'raffleItems.json');
    const userFilePath = path.join(__dirname, 'users.json');

    const rafflePartnerData = JSON.parse(fs.readFileSync(rafflePartnerFilePath, 'utf-8'));
    const raffleItemData = JSON.parse(fs.readFileSync(raffleItemFilePath, 'utf-8'));
    const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

    // Clear existing data
    await RafflePartnerModel.deleteMany({});
    await RaffleItemModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('Cleared existing data.');

    // Insert seed data
    await UserModel.insertMany(userData);
    await RafflePartnerModel.insertMany(rafflePartnerData);
    await RaffleItemModel.insertMany(raffleItemData);
    console.log('User seed data inserted successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    console.log('Seeding process completed.');
    dbConnection?.close();
  }
};

await seedDatabase();
