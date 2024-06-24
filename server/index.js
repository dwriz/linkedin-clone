if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { verifyToken } = require("./helpers/jwt.js");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// typedefs
const { typeDefs: userTypeDefs } = require("./schemas/userSchema.js");
const { typeDefs: followTypeDefs } = require("./schemas/followSchema.js");
const { typeDefs: postTypeDefs } = require("./schemas/postSchema.js");

// resolvers
const { resolvers: userResolvers } = require("./resolvers/userResolvers.js");
const {
  resolvers: followResolvers,
} = require("./resolvers/followResolvers.js");
const { resolvers: postResolvers } = require("./resolvers/postResolvers.js");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
  resolvers: [userResolvers, followResolvers, postResolvers],
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req, res }) => {
    return {
      authentication: async function () {
        if (!req.headers.authorization) throw new Error("no access token");

        const accessToken = req.headers.authorization.split(" ")[1];

        if (!accessToken) throw new Error("no access token");

        const decodedToken = verifyToken(accessToken);

        if (!decodedToken) throw new Error("invalid access token");

        return decodedToken;
      },
    };
  },
})
  .then(({ url }) => {
    console.log(`server ready at ${url}`);
  })
  .catch((error) => {
    console.error(error);
  });
