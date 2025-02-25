import Business from '../../models/business';
import Challenge from '../../models/challenge'; 
import Answer from '../../models/answer';

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

export const getAwardDetails = async (businessId: string) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  return {
    totalAward: business.award_limit,
    remainingAward: business.award_limit - business.awarded_total
  };
};

export const getEventResults = async (businessId: string) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  return {
    totalAward: business.award_limit,
    remainingAward: business.award_limit - business.awarded_total,
    winners: business.winners
  };
};