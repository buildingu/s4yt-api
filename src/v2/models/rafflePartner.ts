import mongoose, {Document, Schema} from 'mongoose';

interface RafflePartner extends Document{
    logo: string;   //URLL of the logo/image not sure
    organizationName: string;
    resourceLink: string;
}

const rafflePartnerSchema = new Schema<RafflePartner>({
    logo: { type: String, required: true },
    organizationName: { type: String, required: true },
    resourceLink: { type: String, required: true },
  });

 const RafflePartnerModel = mongoose.model<RafflePartner>('RafflePartner', rafflePartnerSchema);

 export default RafflePartnerModel;