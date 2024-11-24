import mongoose, { Schema, Document } from "mongoose";

export interface IRating extends Document {
  ratedBy: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
}

const ratingSchema = new Schema<IRating>(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRating>("Rating", ratingSchema);
