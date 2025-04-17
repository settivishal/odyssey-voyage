import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { readFileSync } from 'fs';
import gql from 'graphql-tag';

const typeDefs = gql(readFileSync('./locations.graphql', { encoding: 'utf-8' }));
import resolvers from './resolvers';
import LocationsAPI from './datasources/LocationsApi';

/**
 * Start a standalone Apollo Server for the locations subgraph.
 *
 * The server runs on port 4001 and is configured with the type definitions
 * and resolvers in this module. The context for each request is an object
 * that contains a single data source, `locationsAPI`, which is an instance of
 * `LocationsAPI`.
 *
 * Once the server is running, it logs a message to the console with the URL
 * where the subgraph can be accessed.
 */
async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const port = 4001;
  const subgraphName = 'locations';

  try {
    const { url } = await startStandaloneServer(server, {
      context: async () => {
        return {
          dataSources: {
            locationsAPI: new LocationsAPI(),
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
