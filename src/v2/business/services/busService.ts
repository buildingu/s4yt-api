import Business from '../../models/business';
import Challenge from '../../models/challenge'; 
import Answer from '../../models/answer';

export const updateBusinessInfo = async (businessId: string, businessInfo: any) => {
  const business = await Business.findByIdAndUpdate(businessId, businessInfo, { new: true });
  if (!business) {
    throw new Error('Business not found');
  }
  return business;
};

export const addChallengeToBusiness = async (businessId: string, challengeData: any) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  const challenge = new Challenge({ ...challengeData, business: businessId });
  await challenge.save();

  // FIXME
  //business.challenges.push(challenge._id);
  await business.save();

  return challenge;
};

export const updateBusinessChallenge = async (challengeId: string, updateData: any) => {
  const challenge = await Challenge.findByIdAndUpdate(challengeId, updateData, { new: true });
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  return challenge;
};

export const getBusinessChallenges = async (businessId: string) => {
  const challenges = await Challenge.find({ business: businessId });
  if (!challenges) {
    throw new Error('No challenges found for this business');
  }
  return challenges;
};

export const getAnswersToChallenge = async (challengeId: string) => {
  const answers = await Answer.find({ challenge: challengeId });
  if (!answers.length) {
    throw new Error('No answers found for this challenge');
  }
  return answers;
};



export const updateAwardAmount = async (businessId: string, award: number) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  business.award = award;
  business.awarded_total = business.winners.reduce((sum, w) => sum + w.award, 0); 
  await business.save();

  return business;
};


export const getAwardDetails = async (businessId: string) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  return {
    totalAward: business.award,
    //remainingAward: business.award - business.awardedTotal // TODO: fix this
  };
};


export const selectWinners = async (
  businessId: string,
  winners: { winnerId: string; award: number }[]
) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  let totalAwarded = business.awarded_total;

  for (const { winnerId, award } of winners) {
    if (business.winners.some(w => w?.winner_id?.toString() === winnerId )) {
      throw new Error(`Winner ${winnerId} has already been awarded.`);
    }
    /*if (totalAwarded + award > business.award) {
      throw new Error('Insufficient award balance');
    }*/ 
    // TODO: fix this
    business.winners.push({ winner_id: winnerId, award });
    // totalAwarded += award;
  }

  business.awarded_total = totalAwarded;
  await business.save();

  return business.winners;
};


export const getEventResults = async (businessId: string) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  return {
    totalAward: business.award,
    // remainingAward: business.award - business.awardedTotal, // TODO: fix this
    winners: business.winners
  };
};