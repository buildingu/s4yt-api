import mongoose from "mongoose";
const {Schema, model, Document} = mongoose

const countrySchema = new Schema({
    name: {type: String, required: true},
    abbr: {type: String, required: true},
    callingCode: {type: String, required: true},
    continent: {type: String, required: true},
})

const Country = model('Country', countrySchema)