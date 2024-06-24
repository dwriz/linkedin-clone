const { db } = require("../config/mongodb.js");
const { ObjectId } = require("mongodb");
const { redisClient } = require("../config/redisClient");

const postCollection = db.collection("posts");

class Post {
  static async addPost(args, authorData) {
    const { content, tags, imgUrl } = args;

    if (!content) throw new Error("content is required");

    const newPost = {
      content,
      tags: tags || [],
      imgUrl: imgUrl || "",
      author: {
        _id: new ObjectId(authorData._id),
        name: authorData.name,
        username: authorData.username,
        email: authorData.email,
      },
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postCollection.insertOne(newPost);

    await redisClient.del("posts");
    console.log("redis cache cleared");

    return { message: "add post success" };
  }

  static async addComment(postId, content, username) {
    const newComment = {
      content,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } }
    );

    await redisClient.del("posts");
    console.log("redis cache cleared");

    return { message: "add comment success" };
  }

  static async addLike(postId, username) {
    const post = await postCollection.findOne({ _id: new ObjectId(postId) });
    const existingLike = post.likes.find((like) => like.username === username);

    if (existingLike) {
      throw new Error("post already liked");
    } else {
      const newLike = {
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await postCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: newLike } }
      );

      await redisClient.del("posts");
      console.log("redis cache cleared");

      return { message: "add like success" };
    }
  }

  static async getPosts() {
    const cachedPosts = await redisClient.get("posts");

    if (cachedPosts) {
      console.log("cached data available");
      return JSON.parse(cachedPosts);
    } else {
      console.log("cached data not available");
    }

    const posts = await postCollection.find().toArray();

    await redisClient.setEx("posts", 60, JSON.stringify(posts));
    console.log("redis cache posted");

    return posts;
  }

  static async getPostById(_id) {
    return await postCollection.findOne({ _id: new ObjectId(_id) });
  }
}

module.exports = { Post };
