import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

import AuthService from "./auth.service";
import AuthResponseType from "./auth.graphql";

const AuthQueries = new GraphQLObjectType({
  name: "AuthQueries",
  fields: {},
});

const AuthMutations = new GraphQLObjectType({
  name: "AuthMutations",
  fields: {
    login: {
      type: AuthResponseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }) => {
        return await AuthService.login(email, password);
      },
    },

    signUp: {
      type: AuthResponseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, username, password }) => {
        return await AuthService.signUp(email, username, password);
      },
    },

    switchRole: {
      type: AuthResponseType,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { token }) => {
        return await AuthService.switchRole(token);
      },
    },
  },
});

export { AuthMutations, AuthQueries };
