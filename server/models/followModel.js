const { db } = require("../config/mongodb.js");
const { ObjectId } = require("mongodb");

const followCollection = db.collection("follows");

class Follow {
  static async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error("cannot follow yourself");
    }

    const checkFollow = await followCollection.findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (checkFollow) {
      throw new Error("user already followed");
    }

    await followCollection.insertOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { message: "follow success" };
  }
}

module.exports = { Follow };
