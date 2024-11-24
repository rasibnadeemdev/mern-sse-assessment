import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

const BookingType = new GraphQLObjectType({
  name: "BookingType",
  fields: {
    id: { type: GraphQLID },
    listingId: { type: GraphQLID },
    buyerId: { type: GraphQLID },
    status: { type: GraphQLString },
  },
});

export default BookingType;
