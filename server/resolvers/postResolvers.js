const { Post } = require("../models/postModel.js");

const resolvers = {
  Query: {
    posts: async function () {
      try {
        return await Post.getPosts();
      } catch (error) {
        throw error;
      }
    },
    post: async function (_, args) {
      try {
        const { _id } = args;

        return await Post.getPostById(_id);
      } catch (error) {
        throw error;
      }
    },
  },

  Mutation: {
    addPost: async function (_, args, contextValue) {
      try {
        const { newPost } = args;

        const { authentication } = contextValue;

        const authorData = await authentication();

        return await Post.addPost(newPost, authorData);
      } catch (error) {
        throw error;
      }
    },

    addComment: async function (_, args, contextValue) {
      try {
        const { newComment } = args;

        const { authentication } = contextValue;

        const { username } = await authentication();

        const { postId, content } = newComment;

        return await Post.addComment(postId, content, username);
      } catch (error) {
        throw error;
      }
    },

    addLike: async function (_, args, contextValue) {
      try {
        const { newLike } = args;

        const { authentication } = contextValue;

        const { username } = await authentication();

        const { postId } = newLike;

        return await Post.addLike(postId, username);
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { resolvers };
