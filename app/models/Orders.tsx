import mongoose, { Document, Schema } from "mongoose";

/* 
   OrderSchema will correspond to a collection in your MongoDB database. 
   It defines the structure and data types for the Order collection.
*/

// Interface representing a single document in the Order collection
interface IOrder extends Document {
  domain: string;
  note: string;
  items?: any[];
  status?: string;
  orderId: number;
  user: object;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    
    domain: {
      type: String,
      // required: [true, "domain is required."],
    },
    note: {
      type: String,
      // required: [true, "note is required."],
    },
    status: {
      type: String,
    },
    orderId:{
      type: Number,
    },
    items: {
      type: Array,
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
export default (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);
