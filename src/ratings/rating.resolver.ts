import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql";

import RatingType from "./rating.graphql";
import RatingService from "./rating.service";

const RatingQueries = new GraphQLObjectType({
  name: "RatingQueries",
  fields: {
    ratings: {
      type: new GraphQLList(RatingType),
      resolve: async (_, args, context) => {
        if (!context.user) {
          throw new Error("Unauthorized");
        }

        if (!context.user.isAdmin) {
          throw new Error("Unauthorized");
        }

        return await RatingService.getAllRatings();
      },
    },

    rating: {
      type: RatingType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        return await RatingService.getRatingById(args.id);
      },
    },
  },
});

const RatingMutations = new GraphQLObjectType({
  name: "RatingMutations",
  fields: {
    createRating: {
      type: RatingType,
      args: {
        booking: { type: new GraphQLNonNull(GraphQLString) },
        ratedBy: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { booking, ratedBy, rating }) => {
        return await RatingService.createRating(booking, ratedBy, rating);
      },
    },
  },
});

export { RatingQueries, RatingMutations };
