import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { readFileSync } from 'fs';
import gql from 'graphql-tag';

const typeDefs = gql(readFileSync('./reviews.graphql', { encoding: 'utf-8' }));
import resolvers from './resolvers.js'
import ReviewsAPI from './datasources/ReviewsApi';

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const port = 4002;
  const subgraphName = 'reviews';

  try {
    const { url } = await startStandaloneServer(server, {
      context: async () => {
        return {
          dataSources: {
            reviewsAPI: new ReviewsAPI(),
          },
        };
      },
      listen: { port },
    });

    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  } catch (err) {
    console.error(err);
  }
}

startApolloServer();
