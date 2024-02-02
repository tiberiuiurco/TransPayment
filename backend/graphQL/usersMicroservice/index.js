const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require("../../models/associations")();

const userTypeDefs = require("./userTypeDefs");
const userResolvers = require("./userResolver");

const port = 5002;

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs: gql`
        scalar Date
        scalar JSONObject
      `,
    },
    {
      typeDefs: userTypeDefs,
      resolvers: userResolvers,
    },
  ]),
});
server.listen(process.env.PORT || port).then(({ url }) => {
  console.log(`Users microservice service ready at ${url}`);
});
