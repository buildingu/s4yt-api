import mongoose, { Schema } from 'mongoose';
const apiKeySchema = new Schema({
  key: { type: String, required: true, unique: true },  
  createdAt: { type: Date, default: Date.now }, 
  expiresAt: { type: Date, default: null }, 
  active: { type: Boolean, default: true }, 
  lastUsedAt: { type: Date, default: null } 
}, { collection: 'apikeys' });
const ApiKey = mongoose.model('apiKey', apiKeySchema);
export default ApiKey;