import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import { RafflePartnerModel } from '../../models/rafflePartner.js';
import RaffleItemModel from '../../models/raffleItem.js';
import connectDB from '../../db/db.js';
import Business from '../../models/business.js';
import ChallengeModel from '../../models/challenge.js';
import MultipleChoiceModel from '../../models/multipleChoice.js';
import ChestModel from '../../models/chest.js';
import AdminUserModel from '../../models/adminUser.js';
import AdminBusinessModel from '../../models/adminBusiness.js';
import Country from '../../models/countries.js';
import Regions from '../../models/region.js';

dotenv.config();

const addGameData = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.join(path.dirname(__filename), 'data');
    const __commonDirname = path.join(path.dirname(__filename), '..', 'common', 'data');

    // Load seed data
    const adminUserFilePath = path.join(__dirname, 'adminUser.json');
    const adminBusinessFilePath = path.join(__dirname, 'adminBusiness.json');
    const businessFilePath = path.join(__dirname, 'businesses.json');
    const challengeFilePath = path.join(__dirname, 'challenges.json');
    const regionsFilePath = path.join(__commonDirname, 'regions.json');
    const countriesFilePath = path.join(__commonDirname, 'countries.json');
    const multipleChoiceFilePath = path.join(__dirname, 'multipleChoice.json');
    const rafflePartnerFilePath = path.join(__dirname, 'rafflePartners.json');
    const raffleItemFilePath = path.join(__dirname, 'raffleItems.json');

    const adminUserData = JSON.parse(fs.readFileSync(adminUserFilePath, 'utf-8'));
    const adminBusinessData = JSON.parse(fs.readFileSync(adminBusinessFilePath, 'utf-8'));
    const businessData = JSON.parse(fs.readFileSync(businessFilePath, 'utf-8'));
    const challengeData = JSON.parse(fs.readFileSync(challengeFilePath, 'utf-8'));
    const regionsData = JSON.parse(fs.readFileSync(regionsFilePath, 'utf-8'));
    const countriesData = JSON.parse(fs.readFileSync(countriesFilePath, 'utf-8'));
    const multipleChoiceData = JSON.parse(fs.readFileSync(multipleChoiceFilePath, 'utf-8'));
    const rafflePartnerData = JSON.parse(fs.readFileSync(rafflePartnerFilePath, 'utf-8'));
    const raffleItemData = JSON.parse(fs.readFileSync(raffleItemFilePath, 'utf-8'));

    // Clear existing data
    await AdminUserModel.deleteMany({});
    await AdminBusinessModel.deleteMany({});
    await Business.deleteMany({});
    await Country.deleteMany({});
    await Regions.deleteMany({});
    await ChallengeModel.deleteMany({});
    await MultipleChoiceModel.deleteMany({});
    await ChestModel.deleteMany({});
    await RafflePartnerModel.deleteMany({});
    await RaffleItemModel.deleteMany({});
    console.log('Cleared existing data.');

    // Insert seed data
    await AdminUserModel.insertMany(adminUserData);
    await AdminBusinessModel.insertMany(adminBusinessData);
    await Business.insertMany(businessData);
    await ChallengeModel.insertMany(challengeData);
    await Country.insertMany(countriesData);
    await Regions.insertMany(regionsData);
    await MultipleChoiceModel.insertMany(multipleChoiceData);
    await RafflePartnerModel.insertMany(rafflePartnerData);
    await RaffleItemModel.insertMany(raffleItemData);
    console.log('Game data inserted successfully.');
  } catch (err) {
    console.error('Error adding game data to database:', err);
  } finally {
    console.log('Add game data process completed.');
    dbConnection?.close();
  }
};

await addGameData();
