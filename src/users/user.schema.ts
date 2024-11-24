// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for User document
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: "buyer" | "seller";
}

// Create a schema for the User model
const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the User model
export default mongoose.model<IUser>("User", userSchema);
