import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import bcrypt from "bcryptjs";

import UserService from "../users/users.service";
import UserType from "../users/user.graphql";

import JwtService from "../utils/jwt.service";

const AuthMutations = new GraphQLObjectType({
  name: "AuthMutations",
  fields: {
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }) => {
        const user = await UserService.findUserByEmail(email);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        const authService = JwtService.getInstance();
        const token = authService.sign({ id: user.id, role: user.role }, "1d");

        return { ...user.toObject(), token };
      },
    },

    signUp: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, username, password }) => {
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
          throw new Error("Email is already in use");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await UserService.createUser({
          email,
          username,
          password: hashedPassword,
          isAdmin: false,
          role: "buyer",
        });

        const authService = JwtService.getInstance();
        const token = authService.sign({ id: newUser.id, role: "buyer" }, "1d");

        return { ...newUser.toObject(), token };
      },
    },

    switchRole: {
      type: UserType,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { token }) => {
        const authService = JwtService.getInstance();

        const decoded: any = authService.verify(token);

        if (!decoded || !decoded.id) {
          throw new Error("Invalid token");
        }

        const newRole = decoded.role === "buyer" ? "seller" : "buyer";

        const updatedUser = await UserService.updateUser(decoded.id, {
          role: newRole,
        });
        if (!updatedUser) {
          throw new Error("Failed to update user role");
        }

        const newToken = authService.sign(
          { id: updatedUser.id, role: newRole },
          "1d"
        );

        return { ...updatedUser.toObject(), token: newToken };
      },
    },
  },
});

export { AuthMutations };
