const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require("../../models/associations")();

// const userTypeDefs = require("./userTypeDefs");
// const userResolvers = require("./userResolver");

const inputPaymentsTypeDefs = require("./inputPayments/inputPaymentsTypeDefs");
const inputPaymentsResolvers = require("./inputPayments/inputPaymentsResolver");
const outputPaymentsTypeDefs = require("./outputPayments/outputPaymentsTypeDefs");
const outputPaymentsResolvers = require("./outputPayments/outputPaymentsResolver");

const port = 5003;

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs: gql`
        scalar Date
        scalar JSONObject
      `,
    },
    {
      typeDefs: inputPaymentsTypeDefs,
      resolvers: inputPaymentsResolvers,
    },
    {
      typeDefs: outputPaymentsTypeDefs,
      resolvers: outputPaymentsResolvers,
    },
  ]),
});
server.listen(process.env.PORT || port).then(({ url }) => {
  console.log(`Payments microservice service ready at ${url}`);
});
