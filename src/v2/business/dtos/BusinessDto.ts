import { Request } from 'express';
import { BusinessInfo } from '../../typings/Business';

export interface UpdateBusinessRequestDto extends Request {
  body: BusinessInfo;
  params: {
    businessId: string;
  }
}

export interface GetQuestionsRequestDto extends Request {
  params: {
    businessId: string;
  }
}

export interface AddQuestionRequestDto extends Request {
  body: {
    text: string;
    description: string;
  },
  params: {
    businessId: string;
  }
}

export interface GetAnswersRequestDto extends Request {
  params: {
    questionId: string;
  }
}