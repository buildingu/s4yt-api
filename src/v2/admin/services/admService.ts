import User from '../../models/user';
import Question from '../../models/question';

export const retrieveAllUsers = async () => {
  const users = await User.find({});
  return users;
};

export const kickOutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.kicked = true;
  await user.save();
};

export const banAUser = async (userId: string, duration: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.bannedUntil = new Date(Date.now() + duration);
  await user.save();
};

export const editQuestion = async (questionId: string, questionData: any) => {
  const question = await Question.findByIdAndUpdate(questionId, questionData, { new: true });
  if (!question) {
    throw new Error('Question not found');
  }
  return question;
};