const { User } = require("../models/userModel.js");

const resolvers = {
  Query: {
    users: async function (_, _, contextValue) {
      try {
        const { authentication } = contextValue;

        await authentication();

        return await User.getAllUsers();
      } catch (error) {
        throw error;
      }
    },

    user: async function (_, args, contextValue) {
      try {
        const { authentication } = contextValue;

        await authentication();

        const { _id } = args;

        return await User.getUserById(_id);
      } catch (error) {
        throw error;
      }
    },

    following: async function (_, __, contextValue) {
      try {
        const { authentication } = contextValue;

        const { id: followerId } = await authentication();

        return await User.getFollowing(followerId);
      } catch (error) {
        throw error;
      }
    },

    followers: async function (_, __, contextValue) {
      try {
        const { authentication } = contextValue;

        const { id: followingId } = await authentication();

        return await User.getFollowers(followingId);
      } catch (error) {
        throw error;
      }
    },

    searchUsers: async function (_, args, contextValue) {
      try {
        const { authentication } = contextValue;

        await authentication();

        const { query } = args;

        return await User.searchUsers(query);
      } catch (error) {
        throw error;
      }
    },

    self: async function (_, _, contextValue) {
      try {
        const { authentication } = contextValue;

        const { id } = await authentication();

        return await User.getUserById(id);
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    register: async function (_, args) {
      try {
        const { newUser } = args;

        return await User.register(newUser);
      } catch (error) {
        throw error;
      }
    },

    login: async function (_, args) {
      try {
        const { loginInput } = args;

        return await User.login(loginInput);
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { resolvers };
