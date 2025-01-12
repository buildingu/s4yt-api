import Business from "../../models/business";
import Question from "../../models/question";
import Sponsor from "../../models/sponsor";
import MultipleChoice from "../../models/multipleChoice";
import RaffleItem from "../../models/raffleItem";
import { RafflePartner, RafflePartnerModel } from "../../models/rafflePartner";
import mongoose from "mongoose";
import User from "../../models/user";
import { Types } from "mongoose";
import MultipleChoiceSubmission from "../../models/multipleChoiceSubmission";
import Answer from "../../models/answer";
import { HttpError } from "../../middleware/errorHandler";

export const getRaffleItemsService = async () => {
  try {
    const raffleItems = await RaffleItem.find({});
    
    return raffleItems;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle items: ${error.message}`);
  }
};

export const getRaffleIndicatorCoinsService = async () => {
  try {
    const raffleItems = await RaffleItem.find().populate('stake.user');
    const indicators = raffleItems.map(item => ({
      itemId: item._id,
      goldCoin: item.stake.some(stake => stake.coin_staked > 0),
      silverCoin: item.stake.every(stake => stake.coin_staked === 0)
    }));
    return indicators;
  } catch (error: any) {
    throw new Error(`Error retrieving raffle coin indicators: ${error.message}`);
  }
};


export const getRaffleWinnersService = async (): Promise<Array<{ raffleItemId: mongoose.Types.ObjectId, winnerUserId: mongoose.Types.ObjectId }>> => {
  try {
    const raffleItems = await RaffleItem.find({});

    const winners = raffleItems.map((item): { raffleItemId: mongoose.Types.ObjectId; winnerUserId: mongoose.Types.ObjectId } | null => {
      const totalStakes = item.stake.reduce((acc, stake) => acc + stake.coin_staked, 0);
      let randomPoint = Math.random() * totalStakes;
      for (const stake of item.stake) {
        randomPoint -= stake.coin_staked;
        if (randomPoint <= 0) {
          return { raffleItemId: item._id, winnerUserId: stake.user };
        }
      }
      return null;
    }).filter((winner): winner is { raffleItemId: mongoose.Types.ObjectId; winnerUserId: mongoose.Types.ObjectId } => winner !== null);

    return winners;
  } catch (error: any) {
    throw new Error(`Error determining raffle winners: ${error.message}`);
  }
};

export const createRafflePartner = async (rafflePartnerData: RafflePartner)=>{
  try{
    const newPartner = new RafflePartnerModel(rafflePartnerData);
    await newPartner.save();
    return newPartner;
  }catch(error: any){
    throw new HttpError(`Error creating partner: ${error.toString()}`, 400);
  }
}

export const editRafflePartner = async (id: string, updatedData: any) => {
  const updatedPartner = await RafflePartnerModel.findByIdAndUpdate(id, updatedData, {
    new: true, 
    runValidators: true,
  });
  if (!updatedPartner) {
    throw new HttpError('Raffle partner not found', 404);
  }
  return updatedPartner;
};

export const getAllRafflePartners = async () => {
  try {
    const partners = await RafflePartnerModel.find()
    return partners;
  } catch (error) {
    throw new HttpError('Error fetching raffle partners', 500);
  }
};

export const getRafflePartner = async (id: string) => {
  const partner = await RafflePartnerModel.findById(id)
  if (!partner) {
    throw new HttpError('Raffle partner not found', 404);
  }
  return partner;
};

export const assignCoinsToUser = async (userId: string, coinCount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.coins += coinCount;

  await user.save();

  return user;
};

export const createSponsor = async (sponsorData: any) => {
  const sponsor = new Sponsor(sponsorData);
  await sponsor.save();
  return sponsor;
};

export const addMultipleChoiceToSponsor = async (sponsorId: string, multipleChoiceData: any) => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error('Sponsor not found');
  }

  const multipleChoice = new MultipleChoice({ ...multipleChoiceData, sponsor: sponsorId });
  await multipleChoice.save();

  sponsor.questions.push(multipleChoice._id);
  await sponsor.save();

  return multipleChoice;
};

export const updateSponsor = async (id: String, sponsorData: any) => {
  const sponsor = await Sponsor.findByIdAndUpdate(id, sponsorData, { new: true });
  return sponsor;
};

export const getAllSponsors = async () => {
  const sponsors = await Sponsor.find({});
  return sponsors;
};

export const getMultipleChoiceFromSponsor = async (sponsorId: String) => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error('Sponsor not found');
  }
  
  // const multipleChoice = await MultipleChoice.findById(sponsor.questions[0])
  let multipleChoice : any[] = []
  for (let multipleChoiceId of sponsor.questions){ 
    let question = await MultipleChoice.findById(multipleChoiceId)
    multipleChoice.push(question)
  }

  return multipleChoice
};

export const gradeSponsorQuiz = async (userId: String, sponsorId: String, responses: any) => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new Error('Sponsor not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let submittedQuestions : any[] = [];
  let submissions : any[] = [];

  for (let response of responses) {
    const {answer, multipleChoiceId} = response;
    const multipleChoice = await MultipleChoice.findById(multipleChoiceId);
    
    if (!multipleChoice) {
      throw new Error("Multiple choice question not found")
    }
  
    let isCorrect = answer == multipleChoice.correct_answer;
    submissions.push({user: userId, multipleChoice: multipleChoiceId, isCorrect: isCorrect})
    submittedQuestions.push(multipleChoiceId)
  }

  if (JSON.stringify(submittedQuestions.sort()) != JSON.stringify(sponsor.questions.sort())) {
    throw new Error(`Questions submitted does not completely match quiz`)
  }

  // add record to db
  for (let submission of submissions) {
    const multipleChoiceId = submission.multipleChoice;

    const submissionRecord = await MultipleChoiceSubmission.findOneAndUpdate({"multipleChoice": multipleChoiceId}, submission, {upsert: true})

    // add coins
    if (!submissionRecord) {
      // add 3 coins
      if (submission.isCorrect) {
        addQuizCoins(userId, 3);
      } else {
        addQuizCoins(userId, 1);
      }
    }
  }
  return submissions
}

export const addQuizCoins = async (userId: String, coinCount: number) => {
  try {
    const updatedUser = await User.findById(userId);
    if (updatedUser) {
      updatedUser.coins += coinCount;
      await updatedUser.save();
    }

    return updatedUser;
  } catch (error: any) {
    throw new Error(
      "addQuizCoins service error; adding coins earned from the quiz to the user:\n" +
        error.message
    );
  }
};

export const sendBusinessesInfo = async () => {
  try {
    const allBus = await Business.find();
    if (!allBus) {
      throw new Error('Businesses not found');
    }

    // Count the number of submitted answers to all business questions
    const results = [];
    for (const business of allBus) {
      const numAnswers = await Answer.countDocuments({ business: business.id, status: 'Submitted'});

      const busInfo = {
        id: business.id,
        name: business.name,
        logoS4yt: business.logo_s4yt,
        logoNormal: business.logo_normal,
        description: business.description,
        attachment: business.attachment,
        videoUrls: business.video_urls,
        numAnswers
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

export const saveAnswer = async (questionId: string, userId: string, text: string, submit: boolean = false) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const { business } = question;
  if (!business) {
    throw new Error('Question is not associated with any Business');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!text) {
    throw new Error('Answer text is required');
  }

  const answer = new Answer({
    question,
    business,
    user,
    text,
    status: submit ? 'Submitted' : 'Draft'
  });

  await answer.save();

  const responseObj = {
    _id: answer.id,
    question: question.id,
    business,
    user: user._id,
    text,
    status: answer.status
  }

  return responseObj;
} 

export const updateAnswer = async (answerId: string, text: string, submit: boolean = false) => {
  const updateData = {
    text,
    ...(submit && { status: 'Submitted'})
  };

  const answer = await Answer.findByIdAndUpdate(answerId, updateData, { new: true });
  if (!answer) {
    throw new Error('Answer not found');
  }

  const responseObj = {
    ...answer.toObject(),
    __v: undefined
  }

  return responseObj;
}
  
export const addMeetUp = async (businessId: string, userId: string, rsvpType: string) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (rsvpType === 'Confirm') {
      // TODO: "user" is giving an Error
      //business.meetMembersConfirmed.push(user);
      await business.save();
    }

    return null;
  } catch (error: any) {
    throw new Error(
      "addMeetUp service error; adding meetup answer to the user:\n" +
        error.message
    );
  }
};

export const sendBusinessChallengeWinners = async () => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "sendBusinessChallengeWinners service error; getting business challenge winners:\n" +
        error.message
    );
  }
};

  export const getEventResults = async () => {
    const allBus = await Business.find({});
    if (!allBus) {
      throw new Error('Businesses not found');
    }

    let results = [];
    for (const business of allBus) {
      let businessResults = [];
      const questions = business.questions;

      for (const questionId of questions) {
        const question = await Question.findById(questionId);

        if (!question) continue;

        for (const prize of question.prize_allocation) {
          const user = await User.findById(prize.winner);
          if (!user) continue;

          let award = {
            place: prize.place,
            amount: prize.amount,
            winner_name: user.name,
            winner_region: user.region,
            winner_country: user.country,
          };
          businessResults.push(award);
        }
        
      }
      
      results.push(businessResults)
    }
  
    return results;
  };


export const sendCoinsGainedHistory = async () => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "sendCoinsGainedHistory service error; getting the user's gained coins history:\n" +
        error.message
    );
  }
};

export const getInstructionsForUser = async (userId: mongoose.Types.ObjectId): Promise<any> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const showInstructions = user.show_instructions !== false;

    const instructionsData = {
      title: "Instructions Page",
      content: "Visit each island to answer the questions. Click on raffle page, to use your free DUBL-U-NES.",
      showOnLogin: showInstructions
    };

    return instructionsData;
  } catch (error: any) {
    throw new Error(`Error retrieving instructions: ${error.message}`);
  }
};

export const getTreasureMapData = async (userId: Types.ObjectId) => {
  try {
    // Fetch user details to determine which elements to show on the treasure map
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Fetch raffle items and information
    const raffleItems = await RaffleItem.find({ active: true });
    const raffleData = raffleItems.map(item => ({
      id: item.id,
      name: item.name_raffle_item,
      image: item.image,
      quantity: item.qty
    }));

    const sponsors = await Sponsor.find({});
    const sponsorData = sponsors.map(sponsor => ({
      id: sponsor.id,
      name: sponsor.name,
      logo: sponsor.logo_path, 
    }));

    const treasureMapData = {
      user: {
        name: user.name,
        coins: user.coins, 
      },
      raffle: raffleData,
      sponsors: sponsorData,
    };

    return treasureMapData;
  } catch (error: any) {
    throw new Error(`Error retrieving treasure map data: ${error.message}`);
  }
};

