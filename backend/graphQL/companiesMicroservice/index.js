const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
require("../../models/associations")();

const companyTypeDefs = require("./companyTypeDefs");
const companyResolvers = require("./companyResolver");

const resourceTypeDefs = require("./resources/resourceTypeDefs");
const resourceResolvers = require("./resources/resourceResolver");

const partnerPersonTypeDefs = require("./partnerPerson/partnerPersonTypeDefs");
const partnerPersonResolvers = require("./partnerPerson/partnerPersonResolver");

const partnerCompanyTypeDefs = require("./partnerCompany/partnerCompanyTypeDefs");
const partnerCompanyResolvers = require("./partnerCompany/partnerCompanyResolver");

const flotaTypeDefs = require("./flota/flotaTypeDefs");
const flotaResolvers = require("./flota/flotaResolver");

const port = 5001;

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs: gql`
        scalar Date
        scalar JSONObject
      `,
    },
    {
      typeDefs: companyTypeDefs,
      resolvers: companyResolvers,
    },
    {
      typeDefs: resourceTypeDefs,
      resolvers: resourceResolvers,
    },
    {
      typeDefs: partnerPersonTypeDefs,
      resolvers: partnerPersonResolvers,
    },
    {
      typeDefs: partnerCompanyTypeDefs,
      resolvers: partnerCompanyResolvers,
    },
    {
      typeDefs: flotaTypeDefs,
      resolvers: flotaResolvers,
    },
  ]),
});
server.listen(process.env.PORT || port).then(({ url }) => {
  console.log(`Companies microservice service ready at ${url}`);
});
