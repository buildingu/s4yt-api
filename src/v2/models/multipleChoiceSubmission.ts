import mongoose, { mongo } from "mongoose";

const multipleChoiceSubmissionSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    multiple_choice : {type: mongoose.Schema.Types.ObjectId, ref: "MultipleChoice"},
    is_correct : {type: Boolean, required: true}
});


const MultipleChoiceSubmission = mongoose.model("MultipleChoiceSubmission", multipleChoiceSubmissionSchema)

export default MultipleChoiceSubmission