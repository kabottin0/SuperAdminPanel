import mongoose, { Document, Schema } from "mongoose";

/* 
   OrderSchema will correspond to a collection in your MongoDB database. 
   It defines the structure and data types for the Order collection.
*/

// Interface representing a single document in the Order collection
interface IEcommerce extends Document {
  name: string;
  domain: string;
  status?: string;
  user: object;
  webUser: string;
  webPassword: string;
  restUser: string;
  restPassword: string;
  avaible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EcommerceSchema: Schema<IEcommerce> = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Payment Method is required."],
    },
    domain: {
      type: String,
      // required: [true, "Subtotal is required."],
    },
    status: {
      type: String,
    },
    user: {
      type: Object,
      // required: [true, "User is required."],
    },
    webUser: {
      type: String,
      // required: [true, "Subtotal is required."],
    },
    webPassword: {
      type: String,
      // required: [true, "Subtotal is required."],
    },
    restUser: {
      type: String,
      // required: [true, "Subtotal is required."],
    },
    restPassword: {
      type: String,
      // required: [true, "Subtotal is required."],
    },
    avaible:{
      type: Boolean,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the Order model based on the OrderSchema
export default (mongoose.models.Ecommerce as mongoose.Model<IEcommerce>) ||
  mongoose.model<IEcommerce>("Ecommerce", EcommerceSchema);
