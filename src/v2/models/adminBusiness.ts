import { Schema, Types, model } from "mongoose";
import { AdminBusiness } from "../typings/AdminBusiness";

const adminBusinessSchema = new Schema<AdminBusiness>({
    business_user_id: { type: Types.ObjectId, ref: 'AdminUser', required: true },
    business_name: { type: String, required: true },
    description: { type: String },
    question_main: { type: String },
    questions_learn_earn: [{
      question: String,
      optionA: String,
      optionB: String,
      optionC: String,
      explanation: String,
      correct: String
    }],
    challenge_question: { type: Types.ObjectId, ref: 'Challenge'},
    link: String,
    video_title: String,
    video_url: { type: String },
    title: String,
    logo: { type: String },
    winners: [{_id: false, user: Types.ObjectId,  award: Number}],
    attendance_confirm: { type: Boolean, default: false },
    award_limit: Number,
    awarded_total: Number,
    deleted: { type: Boolean, default: false}
  }, { timestamps: true });
  
const AdminBusinessModel = model('AdminBusiness', adminBusinessSchema);

export default AdminBusinessModel;