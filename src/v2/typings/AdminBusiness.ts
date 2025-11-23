import { Challenge } from "./Challenge";
import { AdminUser } from "./AdminUser";
import User from "./User";

export interface AdminBusiness {
  business_user_id: AdminUser,
  business_name: string,
  description: string,
  question_main: string,
  questions_learn_earn: [{
    question: string,
    optionA: string,
    optionB: string,
    optionC: string,
    explanation: string,
    correct: string
  }],
  challenge_question: Challenge,
  link: string,
  video_title: string,
  video_url: string,
  title: string,
  logo: string,
  winners: {
    user: User;
    award: number;
  }[],
  attendance_confirm: boolean,
  award_limit: number,
  awarded_total: number,
  deleted: boolean
}