import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import { RafflePartnerModel } from '../models/rafflePartner.js';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI is not defined.');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI);

  const connection = mongoose.connection;

  connection.once('open', () => {
    console.log('MongoDB connected');
  });

  connection.on('error', (error) => {
    console.error('Error connecting to MongoDB database: ', error);
  });

  return connection;
};

const seedDatabase = async () => {
  let dbConnection;

  try {
    dbConnection = await connectDB();

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
