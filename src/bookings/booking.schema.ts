import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  listing: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  status: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "pending", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
