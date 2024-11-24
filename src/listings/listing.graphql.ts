import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID,
} from "graphql";

const ListingType = new GraphQLObjectType({
  name: "ListingType",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    seller: { type: GraphQLID },
    status: { type: GraphQLString },
  },
});

export default ListingType;
