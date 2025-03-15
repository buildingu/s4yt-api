import Business from '../../models/business';
import Challenge from '../../models/challenge'; 
import Answer from '../../models/answer';
import { HttpError } from '../../middleware/errorHandler';
import { BusinessInfo } from '../../typings/Business';

export const sendBusinessesInfo = async () => {
  try {
    const allBusinesses = await Business
      .find({}, 'name logo link description challenge_question video_url video_title', { lean: true })
      .populate('challenge_question', '_id title description');

    if (!allBusinesses) {
      throw new HttpError('Businesses not found', 404);
    }

    console.log(allBusinesses);

    // Count the number of submitted answers to all business challenges
    const results = [];
    for (const business of allBusinesses) {
      const {
        name,
        logo,
        link,
        description,
        challenge_question,
        video_url,
        video_title
      } = business;
      //const numAnswers = await Answer.countDocuments({ business: business._id, status: 'Submitted'});

/*
  challenge_question: {
    title: string;
    description: string;
    answers_count: number;
    answer_submitted: boolean;
  };
  */

      const busInfo /*: BusinessInfo*/ = {
        name,
        logo: logo || '',
        link: link || '',
        description: description || '',
        challenge_question,
        video_url: video_url || '',
        video_title: video_title || ''
      };

      results.push(busInfo);
    }
  
    return results;
  } catch (error: any) {
    throw new Error(
      "sendBusinessesInfo service error; getting businesses info:\n" +
        error.message
    );
  }
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