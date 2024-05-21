import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers";
import { SpotifyAPI } from "./datasources/spotify-api";

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./graphql/schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          spotifyAPI: new SpotifyAPI({ cache }),
        },
      };
    },
    listen: {
      port: Number(process.env.PORT) || 4000,
    },
  });
  console.log(`🚀  Server is running! 📭  Query at ${url}`);
}

startApolloServer();
