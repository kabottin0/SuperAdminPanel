import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for the Variant sub-document
interface ISettings extends Document {
  domain: string;
  webUser: string;
  webPassword: string;
  email: string;
  vatNumber: number;
  phone: number;
  restUser: string;
  restPassword: string;
  typeSite: string;
  vatIncluded: boolean;
  sizeColor: boolean;
  decimalNumber: string;
  viewStock: string;
  registration: string;
  payments: string;
  offered: boolean;
  ecommerceModule: {
    birthDiscount: boolean,
    welcomeDiscount: boolean,
    voucher: boolean,
    promoCode: boolean,
    notification: boolean,
    wishList: boolean,
    news: boolean,
    newArrive: boolean,
    promo: boolean,
    evidence: boolean,
    bestSelling: boolean,
    palletVisible: boolean,
    lineVisible: boolean
  }
  siteColor?: {
    primary: string;
    secondary: string;
  }
}

const SettingsSchema: Schema<ISettings> = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    webUser: { type: String, required: true },
    webPassword: { type: String, required: true },
    email: { type: String, required: true },
    vatNumber: { type: Number, required: true },
    phone: { type: Number, required: true },
    restUser: { type: String},
    restPassword: { type: String },
    typeSite: { type: String, required: true },
    vatIncluded: { type: Boolean, required: true },
    sizeColor: { type: Boolean, required: true },
    decimalNumber: { type: String, required: true },
    viewStock: { type: String, required: true },
    registration: { type: String, required: true },
    payments: { type: String, required: true },
    offered: { type: Boolean, required: true },
    ecommerceModule: {
      birthDiscount: {type: Boolean},
      welcomeDiscount: {type: Boolean},
      voucher: {type: Boolean},
      promoCode: {type: Boolean},
      notification: {type: Boolean},
      wishList: {type: Boolean},
      news: {type: Boolean},
      newArrive: {type: Boolean},
      promo: {type: Boolean},
      evidence: {type: Boolean},
      bestSelling: {type: Boolean},
      palletVisible: {type: Boolean},
      lineVisible: {type: Boolean}
    },
    siteColor: {
      primary: { type: String },
      secondary: { type: String }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Settings: Model<ISettings> =
  (mongoose.models.Settings as Model<ISettings>) ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
