import mongoose, { Document, Model, Schema } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
export interface Customers extends Document {
  customerName: string;
  businessName: string;
  iva: string;
  address: string;
  phone: string;
  email: string;
  user: mongoose.Schema.Types.ObjectId;
  status: string;
  joined: Date;
}

const CustomersSchema: Schema<Customers> = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Please provide a Customer name."],
      maxlength: [20, "First Name cannot be more than 20 characters."],
    },
    businessName: {
      type: String,
      required: [true, "Please provide a  name of company."],
      maxlength: [40, "Last Name cannot be more than 40 characters."],
    },
    iva: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Please provide a Phone Number."],
      maxlength: [20, "Phone cannot be more than 20 characters."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required."],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    status: {
      type: String,
    },
    
  },
  { timestamps: true }
);


const Customers: Model<Customers> =
  mongoose.models.Customers || mongoose.model<Customers>("Customers", CustomersSchema); 
export default Customers;