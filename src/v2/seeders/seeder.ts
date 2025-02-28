import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import { RafflePartnerModel } from '../models/rafflePartner.js';
import connectDB from '../db/db.js';

dotenv.config();

const seedDatabase = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load seed data
    const rafflePartnerFilePath = path.join(__dirname, 'rafflePartners.json');
    const rafflePartnerData = JSON.parse(fs.readFileSync(rafflePartnerFilePath, 'utf-8'));

    // Clear existing data
    await RafflePartnerModel.deleteMany({});
    console.log('Cleared existing RafflePartner data.');

    // Insert seed data
    await RafflePartnerModel.insertMany(rafflePartnerData);
    console.log('User seed data inserted successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    console.log('Seeding process completed.');
    dbConnection?.close();
  }
};

await seedDatabase();
