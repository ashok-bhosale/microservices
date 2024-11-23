//npm install @apollo/server graphql graphql-tag express cors body-parser axios

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { gql } = require('graphql-tag');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

// Define GraphQL schema
const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    getItems: [Item]
  }
`;

// Resolver to fetch items
const resolvers = {
  Query: {
    getItems: async () => {
      const response = await axios.get('http://localhost:3001/items');
      return response.data.items;
    },
  },
};

async function startServer() {
  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // Start the server

  const app = express();
  const port = 3002;

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/graphql', expressMiddleware(server)); // Attach Apollo middleware to the app

  // Start the Express server
  app.listen(port, () => {
    console.log(`SYS API (GraphQL) running on http://localhost:${port}/graphql`);
  });
}

startServer();
