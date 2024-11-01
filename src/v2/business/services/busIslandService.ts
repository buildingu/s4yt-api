import Answer from "../../models/answer";
import Business from "../../models/business";

export const getBusinesses = async () => {
  const allBus = await Business.find();

  if (!allBus) {
    throw new Error('Businesses not found');
  }

  const results = [];

  for (const business of allBus) {
    const numAnswers = await Answer.countDocuments({ business: business.id });

    const busInfo = {
      name: business.name,
      logo: business.logoNormal,
      numAnswers
    }

    results.push(busInfo);
  }

  return results;
};