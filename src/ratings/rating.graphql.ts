import { GraphQLObjectType, GraphQLFloat, GraphQLID } from "graphql";

const RatingType = new GraphQLObjectType({
  name: "RatingType",
  fields: {
    id: { type: GraphQLID },
    rating: { type: GraphQLFloat },
    booking: { type: GraphQLID },
    ratedBy: { type: GraphQLID },
  },
});

export default RatingType;
