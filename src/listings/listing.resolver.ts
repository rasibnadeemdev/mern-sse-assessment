import { GraphQLID, GraphQLString, GraphQLFloat } from "graphql";

import ListingType from "./listing.graphql";
import ListingService from "./listing.service";
import { IListing } from "./listing.schema";

const ListingMutations = {
  createListing: {
    type: ListingType,
    args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      price: { type: GraphQLFloat },
    },
    resolve: async (_: any, args: IListing, context: any) => {
      const sellerId = context.user.id;
      if (context.user.role !== "seller") {
        throw new Error("You are not authorized to create a listing");
      }
      if (!sellerId) {
        throw new Error("Unauthorized");
      }
      return await ListingService.createListing(sellerId, args);
    },
  },

  updateListing: {
    type: ListingType,
    args: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      price: { type: GraphQLFloat },
    },
    resolve: async (_: any, args: IListing, context: any) => {
      const sellerId = context.user.id;
      if (context.user.role !== "seller") {
        throw new Error("You are not authorized to update this listing");
      }
      if (!sellerId) {
        throw new Error("Unauthorized");
      }
      return await ListingService.updateListing(args.id, sellerId, args);
    },
  },

  deleteListing: {
    type: GraphQLString,
    args: {
      id: { type: GraphQLID },
    },
    resolve: async (_: any, args: { id: string }, context: any) => {
      const sellerId = context.user.id;
      if (context.user.role !== "seller") {
        throw new Error("You are not authorized to update this listing");
      }
      if (!sellerId) {
        throw new Error("Unauthorized");
      }
      return await ListingService.deleteListing(args.id, sellerId);
    },
  },

  markOrderCompleted: {
    type: ListingType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: async (_: any, args: { id: string }, context: any) => {
      const sellerId = context.user.id;
      if (context.user.role !== "seller") {
        throw new Error("You are not authorized to update this listing");
      }
      if (!sellerId) {
        throw new Error("Unauthorized");
      }
      return await ListingService.markAsComplete(args.id, sellerId);
    },
  },
};

export { ListingMutations };
