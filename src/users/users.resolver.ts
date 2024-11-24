import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";
import UserType from "./user.graphql";
import UserService from "./users.service";

// Queries
const UserQueries = new GraphQLObjectType({
  name: "UserQueryType",
  fields: {
    // Todo: Only Admin User can fetch All the users.
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, args, context) => {
        if (!context.user.isAdmin) {
          throw new Error("Unauthorized");
        }
        return await UserService.findAllUsers();
      },
    },

    // Todo: Only Admin user and the user himself can fetch their data.
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args, context) => {
        if (!context.user.isAdmin && args.id !== context.user._id) {
          throw new Error("Unauthorized");
        }
        return await UserService.getUser(args.id);
      },
    },
  },
});

// Mutations
const UserMutations = new GraphQLObjectType({
  name: "UserMutations",
  fields: {
    // Todo: Only Admin user can update another to become an admin
    updateUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
        isAdmin: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: async (_, args, context) => {
        if (args.isAdmin && !context.user.isAdmin) {
          throw new Error("Only an admin can make someone an admin");
        }
        return await UserService.updateUser(args.id, args);
      },
    },

    // Only Admin user and the user himself can delete their account.
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args, context) => {
        const userId = context?.user._id;
        const isAdmin = context?.user.isAdmin;

        if (!userId) {
          throw new Error("Unauthorized");
        }

        if (!isAdmin || args.id !== userId) {
          throw new Error("You cannot complete this operation");
        }

        return await UserService.deleteUser(args.id);
      },
    },
  },
});

export { UserMutations, UserQueries };
