import User from '../../models/user';
import Question from '../../models/question';
import Business from '../../models/business';
import ChestModel from '../../models/chest';
import MultipleChoiceModel from '../../models/multipleChoice';

export const retrieveAllUsers = async () => {
  const users = await User.find({});
  return users;
};

export const retrieveAllBusinesses = async () => {
  const businesses = await Business.find({});
  return businesses;
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

  user.banned_until = new Date(Date.now() + duration);
  await user.save();
};

export const createBusiness = async (name: string, logo: string, description: string) => {
  const business = new Business({
    name,
    logo,
    description
  });
  await business.save();
}

export const editQuestion = async (questionId: string, questionData: any) => {
  const question = await Question.findByIdAndUpdate(questionId, questionData, { new: true });
  if (!question) {
    throw new Error('Question not found');
  }
  return question;
};

export const createChest = async (chestGroupData: any) => {
  const chestGroup = await Promise.all(
    chestGroupData.map(async (questionData: any) => {
      const multipleChoice = new MultipleChoiceModel(questionData);
      await multipleChoice.save();
      return multipleChoice;
    })
  );

  const chest = new ChestModel({
    group: chestGroup
  });

  await chest.save();
  return chest;
}