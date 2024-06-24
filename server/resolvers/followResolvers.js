const { Follow } = require("../models/followModel.js");

const resolvers = {
  Mutation: {
    followUser: async function (_, args, contextValue) {
      try {
        const { followingId } = args;

        const { authentication } = contextValue;

        const { id: followerId } = await authentication();

        return await Follow.followUser(followerId, followingId);
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { resolvers };
