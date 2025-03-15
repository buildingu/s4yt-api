import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import { RafflePartnerModel } from '../models/rafflePartner.js';
import RaffleItemModel from '../models/raffleItem.js';
import connectDB from '../db/db.js';
import UserModel from '../models/user.js';
import Business from '../models/business.js';
import ChallengeModel from '../models/challenge.js';

dotenv.config();

const seedDatabase = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load seed data
    const businessFilePath = path.join(__dirname, 'data/businesses.json');
    const challengeFilePath = path.join(__dirname, 'data/challenges.json');
    const rafflePartnerFilePath = path.join(__dirname, 'data/rafflePartners.json');
    const raffleItemFilePath = path.join(__dirname, 'data/raffleItems.json');
    const userFilePath = path.join(__dirname, 'data/users.json');

    const businessData = JSON.parse(fs.readFileSync(businessFilePath, 'utf-8'));
    const challengeData = JSON.parse(fs.readFileSync(challengeFilePath, 'utf-8'));
    const rafflePartnerData = JSON.parse(fs.readFileSync(rafflePartnerFilePath, 'utf-8'));
    const raffleItemData = JSON.parse(fs.readFileSync(raffleItemFilePath, 'utf-8'));
    const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

    // Clear existing data
    await Business.deleteMany({});
    await ChallengeModel.deleteMany({});
    await RafflePartnerModel.deleteMany({});
    await RaffleItemModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('Cleared existing data.');

    // Insert seed data
    await UserModel.insertMany(userData);
    await Business.insertMany(businessData);
    await ChallengeModel.insertMany(challengeData);
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
