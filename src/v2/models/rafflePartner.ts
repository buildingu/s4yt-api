import {Schema, model} from 'mongoose';
import { RafflePartner } from '../typings/RafflePartner';

const rafflePartnerSchema = new Schema<RafflePartner>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    resource_name: { type: String, required: true },
    resource_link: { type: String, required: true },
    resource_category: { type: String, required: true },
    deleted: { type: Boolean, default: false }
  });

 export const RafflePartnerModel = model<RafflePartner>('RafflePartner', rafflePartnerSchema);