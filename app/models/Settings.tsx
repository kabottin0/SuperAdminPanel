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
  ecommerceModule?: any[];
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
    restUser: { type: String, required: true },
    restPassword: { type: String, required: true },
    typeSite: { type: String, required: true },
    vatIncluded: { type: Boolean, required: true },
    sizeColor: { type: Boolean, required: true },
    decimalNumber: { type: String, required: true },
    viewStock: { type: String, required: true },
    registration: { type: String, required: true },
    payments: { type: String, required: true },
    offered: { type: Boolean, required: true },
    ecommerceModule: [{ type: Schema.Types.Mixed }],
    siteColor: {
      primary: { type: String },
      secondary: { type: String }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the Order model based on the OrderSchema
export default (mongoose.models.Settings as mongoose.Model<ISettings>) ||
  mongoose.model<ISettings>("Settings", SettingsSchema);