import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import UserModel from '../models/user.js';
import BusinessModel from '../models/business.js';

const seedDatabase = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load seed data
    const userFilePath = path.join(__dirname, 'user.json');
    const businessFilePath = path.join(__dirname, 'business.json');

    const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
    const businessData = JSON.parse(fs.readFileSync(businessFilePath, 'utf-8'));

    // Clear existing data
    await UserModel.deleteMany({});
    console.log('Cleared existing User data.');
    await BusinessModel.deleteMany({});
    console.log('Cleared existing Business data.');

    // Insert seed data
    await UserModel.insertMany(userData);
    console.log('User seed data inserted successfully.');
    await BusinessModel.insertMany(businessData);
    console.log('Business seed data inserted successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    console.log('Seeding process completed.');
  }
};

seedDatabase();
