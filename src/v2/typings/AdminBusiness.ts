import { Types } from "mongoose";
import { Challenge } from "./Challenge";
import { AdminUser } from "./AdminUser";

export interface AdminBusiness {
  business_user_id: AdminUser,
  business_name: String,
  description: String,
  question_main: String,
  questions_learn_earn: [{
    question: String,
    optionA: String,
    optionB: String,
    optionC: String,
    explanation: String,
    correct: String
  }],
  challenge_question: Challenge,
  link: String,
  video_title: String,
  video_url: String,
  title: String,
  logo: String,
  winners: [{user: Types.ObjectId, award: Number}],
  attendance_confirm: Boolean,
  award_limit: Number,
  awarded_total: Number,
  deleted: Boolean
}