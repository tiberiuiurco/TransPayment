const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { exec } = require("child_process");
const logger = require("./winston/index");
require("./models/associations")();

const api_url = "http://192.168.1.225";

async function runMigrations() {
  try {
    await new Promise((resolve, reject) => {
      const migrate = exec(
        "npx sequelize-cli db:migrate --debug",
        { env: process.env },
        (err) => (err ? reject(err) : resolve())
      );

      // Forward stdout+stderr to this process
      migrate.stdout.pipe(process.stdout);
      migrate.stderr.pipe(process.stderr);
    });
  } catch (error) {
    console.log(error);
  }
}

try {
  runMigrations();
} catch (error) {
  console.log(error);
}
console.log("CV: " + process.env.COMPANIES_ENDPOINT);

// Initialize an ApolloGateway instance and pass it
// the supergraph schema
const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "companies",
      url: process.env.COMPANIES_ENDPOINT
        ? process.env.COMPANIES_ENDPOINT + ":" + process.env.COMPANIES_PORT
        : api_url + ":" + 5001,
    },
    {
      name: "users",
      url: process.env.USERS_ENDPOINT
        ? process.env.USERS_ENDPOINT + ":" + process.env.USERS_PORT
        : api_url + ":" + 5002,
    },
    {
      name: "payments",
      url: process.env.PAYMENTS_ENDPOINT
        ? process.env.PAYMENTS_ENDPOINT + ":" + process.env.PAYMENTS_PORT
        : api_url + ":" + 5003,
    },
  ],
});

function getQueryName(query) {
  return query.replace(/\s+/g, "").split(/[^A-Za-z]/)[1];
}

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext) {
    let query = getQueryName(requestContext.request.query);
    logger.verbose({ query, message: "Request received from client" });

    logger.debug({ query, message: "Request started!" });
    return {
      parsingDidStart(requestContext) {
        logger.verbose({ query, message: "Request parsing started!" });
        return (err) => {
          if (err) {
            logger.error({ error: err, query });
          }
        };
      },

      validationDidStart(requestContext) {
        logger.verbose({ query, message: "Request validation started!" });
        return (errs) => {
          if (errs) {
            errs.forEach((err) => {
              logger.error({ error: err, query });
            });
          }
        };
      },
    };
  },
};

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [myPlugin],
  introspection: true,
  cors: {
    origin: [
      "http://localhost:4200",
      "http://192.168.1.225:4200",
      process.env.CORS_ORIGIN,
    ],
  },
  formatError: (err) => {
    // Don't give the specific errors to the client.
    logger.error(err);
    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    return err;
  },
});

server
  .start()
  .then((res) => {
    server
      .listen(5000)
      .then(({ url }) => {
        logger.info(`Server ready at ${url}`);
        console.log(`🚀 Server ready at ${url}`);
      })

      .catch((error) => logger.error(`Error starting apollo server ${error}`));
  })
  .catch((error) => logger.error(`Error starting apollo server ${error}`));
