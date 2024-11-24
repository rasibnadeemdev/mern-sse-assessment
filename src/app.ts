import express, { Request } from "express";
import { graphqlHTTP } from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
const { createHandler } = require("graphql-http/lib/use/express");
import schema from "./schema";
import { authenticateUserToken } from "./auth/middleware/auth.middleware";
dotenv.config();
const app = express();
app.use(morgan("common"));

app.use(
  cors({
    origin: ["*"], // Comma separated list of your urls to access your api. * means allow everything
    credentials: true, // Allow cookies to be sent with requests
  })
);
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use("/graphql", graphqlHTTP({ schema, graphiql: false }));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use(express.json());

// DB CONNECTION

if (!process.env.MONGODB_URL) {
  throw new Error("MONGO_URI environment variable is not defined");
}

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected to the backend successfully");
    console.log();
  })
  .catch((err: Error) => console.log(err));

// Create and use the GraphQL handler.

app.use("/graphql", authenticateUserToken);

app.use(
  "/graphql",
  graphqlHTTP(async (req, res) => {
    const request = req as Request;

    const context = {
      // @ts-ignore
      user: request.user,
    };
    return { schema, graphiql: process.env.NODE_ENV !== "production", context };
  })
);

// Start backend server
const PORT = process.env.PORT || 8500;

// Check if it's not a test environment before starting the server

app.listen(PORT, () => {
  console.log(`Backend server is running at port ${PORT}`);
  console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
  console.log(`Playground is running on http://localhost:${PORT}/playground`);
});

export default app;
