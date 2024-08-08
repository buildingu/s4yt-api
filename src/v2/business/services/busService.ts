import Business from '../../models/business';
import Question from '../../models/question'; 
import Answer from '../../models/answer';

export const addQuestionToBusiness = async (businessId: string, questionData: any) => {
  const business = await Business.findById(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  const question = new Question({ ...questionData, business: businessId });
  await question.save();

  business.questions.push(question._id);
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

export const updateBusinessInfo = async (businessId: string, businessInfo: any) => {
  const business = await Business.findByIdAndUpdate(businessId, businessInfo, { new: true });
  if (!business) {
    throw new Error('Business not found');
  }
  return business;
};

export const getAnswersToBusinessQuestions = async (businessId: string) => {
  const answers = await Answer.find({ business: businessId });
  if (!answers.length) {
    throw new Error('No answers found for this business');
  }
  return answers;
};
