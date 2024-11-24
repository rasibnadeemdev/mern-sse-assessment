import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";

import BookingType from "./booking.graphql";
import BookingService from "./booking.service";
import RatingService from "../ratings/rating.service";

const BookingMutations = {
  createBooking: {
    type: BookingType,
    args: {
      listingId: { type: GraphQLID },
    },
    resolve: async (_: any, args: { listingId: string }, context: any) => {
      const buyerId = context.user.id;
      if (!buyerId || context.user.role !== "buyer") {
        throw new Error("Unauthorized");
      }

      return await BookingService.createBooking(buyerId, args.listingId);
    },
  },

  rateOrder: {
    type: BookingType,
    args: {
      bookingId: { type: GraphQLID },
      rating: { type: GraphQLInt },
    },

    resolve: async (
      _: any,
      args: { bookingId: string; rating: number },
      context: any
    ) => {
      const ratedBy = context.user.id;
      if (!ratedBy) {
        throw new Error("Unauthorized");
      }
      return await RatingService.createRating(
        args.bookingId,
        ratedBy,
        args.rating
      );
    },
  },
};

export { BookingMutations };
