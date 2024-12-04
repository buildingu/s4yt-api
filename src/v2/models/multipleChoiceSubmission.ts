import mongoose, { mongo } from "mongoose";

const multipleChoiceSubmissionSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    multipleChoice : {type: mongoose.Schema.Types.ObjectId, ref: "MultipleChoice"},
    isCorrect : {type: Boolean, required: true}
});


const MultipleChoiceSubmission = mongoose.model("MultipleChoiceSubmission", multipleChoiceSubmissionSchema)

export default MultipleChoiceSubmission