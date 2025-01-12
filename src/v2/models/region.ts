import mongoose from "mongoose";
import { Region } from "../typings/Region";
const {Schema, model, Document} = mongoose

const regionSchema = new Schema({
    countryName: {type: String, required: true},
    abbr: {type: String, required: true},
    regions: {type: Array<Region>, required: true},
})

const Regions = model('Region', regionSchema)