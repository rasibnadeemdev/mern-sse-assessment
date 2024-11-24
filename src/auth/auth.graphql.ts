import { GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "../users/user.graphql";

const AuthResponseType = new GraphQLObjectType({
  name: "AuthResponseType",
  fields: {
    token: { type: GraphQLString },
    user: { type: UserType },
  },
});

export default AuthResponseType;
