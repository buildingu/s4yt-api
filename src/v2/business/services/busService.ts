import Business from '../../models/business';
import Question from '../../models/question'; 
import Answer from '../../models/answer';

export const updateBusinessInfo = async (businessId: string, businessInfo: any) => {
  const business = await Business.findByIdAndUpdate(businessId, businessInfo, { new: true });
  if (!business) {
    throw new Error('Business not found');
  }
  return business;
};

export const addQuestionToBusiness = async (businessId: string, questionData: any) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  const question = new Question({ ...questionData, business: businessId });
  await question.save();

  // FIXME
  //business.questions.push(question._id);
  await business.save();

  return question;
};

export const updateBusinessQuestion = async (questionId: string, updateData: any) => {
  const question = await Question.findByIdAndUpdate(questionId, updateData, { new: true });
  if (!question) {
    throw new Error('Question not found');
  }
  return question;
};

export const getBusinessQuestions = async (businessId: string) => {
  const questions = await Question.find({ business: businessId });
  if (!questions) {
    throw new Error('No questions found for this business');
  }
  return questions;
};

export const getAnswersToQuestion = async (questionId: string) => {
  const answers = await Answer.find({ question: questionId });
  if (!answers.length) {
    throw new Error('No answers found for this question');
  }
  return answers;
};



export const updateAwardAmount = async (businessId: string, award: number) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  business.award = award;
  business.awardedTotal = business.winners.reduce((sum, w) => sum + w.award, 0); 
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

  let totalAwarded = business.awardedTotal;

  for (const { winnerId, award } of winners) {
    if (business.winners.some(w => w?.winnerId?.toString() === winnerId )) {
      throw new Error(`Winner ${winnerId} has already been awarded.`);
    }
    /*if (totalAwarded + award > business.award) {
      throw new Error('Insufficient award balance');
    }*/ 
    // TODO: fix this
    business.winners.push({ winnerId, award });
    // totalAwarded += award;
  }

  business.awardedTotal = totalAwarded;
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