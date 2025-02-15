import mongoose, {Document, Schema} from 'mongoose';

export interface RafflePartner extends Document{
    logo: string;
    organization_name: string;
    resource_link: string;
    resource_category: string;
    deleted: boolean;
}

const rafflePartnerSchema = new Schema<RafflePartner>({
    logo: { type: String, required: true },
    organization_name: { type: String, required: true },
    resource_link: { type: String, required: true },
    resource_category: { type: String, required: true },
    deleted: { type: Boolean, default: false }
  });

 export const RafflePartnerModel = mongoose.model<RafflePartner>('RafflePartner', rafflePartnerSchema);