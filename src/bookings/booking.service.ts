import bookingSchema, { IBooking } from "./booking.schema";
import listingSchema from "../listings/listing.schema";

class BookingService {
  public async createBooking(
    buyerId: string,
    listingId: string
  ): Promise<IBooking> {
    const listing = await listingSchema.findById(listingId);
    if (!listing) {
      throw new Error("Listing does not exist");
    }
    if (listing.seller.toString() === buyerId) {
      throw new Error("You cannot book your own listing");
    }

    const newBooking = new bookingSchema({
      listing: listingId,
      buyer: buyerId,
      status: "pending",
    });

    await newBooking.save();
    return newBooking;
  }

  public async findBookingById(id: string): Promise<IBooking | null> {
    const booking = await bookingSchema.findById(id);
    return booking;
  }
}

export default new BookingService();
