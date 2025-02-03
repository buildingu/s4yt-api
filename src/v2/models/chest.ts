import mongoose, { Schema, Types } from "mongoose";
import { Chest } from "../typings/Chest";
import { randomUUID } from "crypto";

const chestSchema = new Schema<Chest>({
  chest_id: { type: String, default: () => randomUUID()},
  group: [{ type: Types.ObjectId, ref: 'MultipleChoice' }]
});

const ChestModel = mongoose.model('Chest', chestSchema);

export default ChestModel;
