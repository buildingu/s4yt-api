import dotenv from 'dotenv';
import Business from '../models/business';
import ChestModel from '../models/chest';
import MultipleChoiceModel from '../models/multipleChoice';
import connectDB from '../db/db';

dotenv.config();

const createChests = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const businesses = await Business.find({}, '_id admin_business_id').lean();
    const newChests = [];

    for (const business of businesses) {
      const chestExists = await ChestModel.exists({ business_id: business._id });
      if (chestExists) {
        console.log(`Chest for Business ${business._id} already exists.`);
        continue;
      }

      const { admin_business_id } = business;
      console.log(`Creating chest for Business ${business._id} (AdminBusiness id: ${admin_business_id})...`);
      const multipleChoices = await MultipleChoiceModel.find({ business_id: admin_business_id, deleted: { $ne: true }}, '_id');
      if (multipleChoices.length === 0) {
        console.log(`No MultipleChoices found for AdminBusiness ${admin_business_id}.`);
        continue;
      }

      newChests.push(new ChestModel({
        business_id: business._id,
        group: multipleChoices.map(multipleChoice => multipleChoice._id)
      }));
    }

    console.log(`Inserting ${newChests.length} Chest(s) to DB...`)
    console.log(newChests);

    if (newChests.length > 0) {
      await ChestModel.insertMany(newChests);
    }

    console.log('Chests inserted successfully.');
  } catch (err) {
    console.error('Error creating chests:', err);
  } finally {
    console.log('Chest creation process completed.');
    dbConnection?.close();
  }
}

createChests();