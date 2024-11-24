import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserQueries, UserMutations } from "./users/users.resolver";
import { AuthMutations } from "./auth/auth.resolver";

const rootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...UserQueries.getFields,
    // Todo: Add More Resolvers here for each of the defined modules
  },
});

const rootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...UserMutations.getFields,
    ...AuthMutations.getFields,
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export default schema;
