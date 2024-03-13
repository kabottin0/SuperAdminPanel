import mongoose, { Document, Schema } from "mongoose";

/* 
   OrderSchema will correspond to a collection in your MongoDB database. 
   It defines the structure and data types for the Order collection.
*/

// Interface representing a single document in the Order collection
interface IEcommerce extends Document {
  ecommerceName: string;
  domain: string;
  status?: string;
  orderNo?: string;
  user: object;
  createdAt: Date;
  updatedAt: Date;
}

const EcommerceSchema: Schema<IEcommerce> = new mongoose.Schema(
  {
    ecommerceName: {
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
    orderNo: {
      type: String,
    },
    user: {
      type: Object,
      // required: [true, "User is required."],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the Order model based on the OrderSchema
export default (mongoose.models.Ecommerce as mongoose.Model<IEcommerce>) ||
  mongoose.model<IEcommerce>("Ecommerce", EcommerceSchema);
