import bookingService from "../bookings/booking.service";
import UserService from "../users/users.service";
import ratingSchema from "./rating.schema";

class RatingService {
  static async getAllRatings() {
    try {
      return await ratingSchema.find().populate("booking ratedBy");
    } catch (error: any) {
      throw new Error(`Failed to fetch ratings: ${error.message}`);
    }
  }

  static async getRatingById(id: string) {
    try {
      const rating = await ratingSchema
        .findById(id)
        .populate("booking ratedBy");
      if (!rating) {
        throw new Error("Rating not found");
      }
      return rating;
    } catch (error: any) {
      throw new Error(`Failed to fetch rating: ${error.message}`);
    }
  }

  static async createRating(booking: string, ratedBy: string, rating: number) {
    try {
      const bookingExists = await bookingService.findBookingById(booking);
      if (!bookingExists) {
        throw new Error("Booking not found");
      }

      const userExists = await UserService.getUser(ratedBy);
      if (!userExists) {
        throw new Error("User not found");
      }

      const newRating = new ratingSchema({ booking, ratedBy, rating });
      return await newRating.save();
    } catch (error: any) {
      throw new Error(`Failed to create rating: ${error.message}`);
    }
  }
}

export default RatingService;
