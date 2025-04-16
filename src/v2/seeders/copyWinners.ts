import dotenv from 'dotenv';
import connectDB from '../db/db';
import AdminBusinessModel from '../models/adminBusiness';
import Business from '../models/business';

dotenv.config();

// Copies challenge winners from AdminBusiness to Business
const copyWinners = async () => {
  let dbConnection;

  try {
    dbConnection = connectDB();

    const adminBusinesses = await AdminBusinessModel.find({}, '_id winners');
    const businesses = await Business.find({});

    for (const adminBusiness of adminBusinesses) {
      const business = businesses.find(biz => biz.admin_business_id.equals(adminBusiness._id));
      if (!business) continue;

      business.winners = adminBusiness.winners.map(winner => {
        return {
          user_id: winner.user,
          award: winner.award
        };
      });

      await business.save();
    }
  } catch (err) {
    console.error('Error copying winners:', err);
  } finally {
    console.log('Winner copying completed.');
    dbConnection?.close();
  }
};

copyWinners();