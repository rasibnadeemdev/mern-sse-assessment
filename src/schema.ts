import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserQueries, UserMutations } from "./users/users.resolver";
import { AuthMutations } from "./auth/auth.resolver";
import { ListingMutations } from "./listings/listing.resolver";

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQueries.getFields,
  },
});

const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...UserMutations.getFields,
    ...AuthMutations.getFields,
    ...ListingMutations,
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export default schema;
