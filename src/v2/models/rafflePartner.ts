import mongoose, {Document, Schema} from 'mongoose';

export interface RafflePartner extends Document{
    logo: string;
    organization_name: string;
    resource_link: string;
    education_category: string;
}

const rafflePartnerSchema = new Schema<RafflePartner>({
    logo: { type: String, required: true },
    organization_name: { type: String, required: true },
    resource_link: { type: String, required: true },
    // education_category
  });

 export const RafflePartnerModel = mongoose.model<RafflePartner>('RafflePartner', rafflePartnerSchema);