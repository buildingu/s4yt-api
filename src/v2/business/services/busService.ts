import Business from '../../models/business';
import Answer from '../../models/answer';
import { HttpError } from '../../middleware/errorHandler';
import { BusinessInfo } from '../../typings/Business';
import { Challenge } from '../../typings/Challenge';

export const sendBusinessesInfo = async (userId: string) => {
  try {
    const allBusinesses = await Business
      .find({}, 'name logo link description challenge_question video_url video_title', { lean: true })
      .populate<{ challenge_question: Challenge }>({
        path: 'challenge_question',
        model: 'Challenge',
        select: '_id title description',
        options: { lean: true }
      });

    if (!allBusinesses) {
      throw new HttpError('Businesses not found', 404);
    }

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
      
      // Count the number of submitted answers to all business challenges
      const answers = await Answer.find({ challenge_id: challenge_question._id }, '', { lean: true });
      const answersCount = answers.length;
      const answerSubmitted = answers.findIndex(answer => answer.user.toString() === userId) !== -1;

      const busInfo: BusinessInfo = {
        name,
        logo: logo || '',
        link: link || '',
        description: description || '',
        challenge_question: {
          title: challenge_question.title,
          description: challenge_question.description,
          answers_count: answersCount,
          answer_submitted: answerSubmitted
        },
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