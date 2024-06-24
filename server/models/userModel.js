const { db } = require("../config/mongodb.js");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.js");
const { validateEmail } = require("../helpers/validator.js");
const { signToken } = require("../helpers/jwt.js");
const { ObjectId } = require("mongodb");

const userCollection = db.collection("users");
const followCollection = db.collection("follows");

class User {
  static async register(args) {
    if (!args.name) throw new Error("name is required");
    if (!args.username) throw new Error("username is required");
    if (!args.email) throw new Error("email is required");
    if (!args.password) throw new Error("password is required");

    if (!validateEmail(args.email)) throw new Error("invalid email format");

    if (args.password.length < 5)
      throw new Error("password must be at least 5 characters long");

    const emailCheck = await userCollection.findOne({ email: args.email });
    if (emailCheck) throw new Error("email already in use");

    const usernameCheck = await userCollection.findOne({
      username: args.username,
    });
    if (usernameCheck) throw new Error("username already in use");

    await userCollection.insertOne({
      name: args.name,
      username: args.username,
      email: args.email,
      password: hashPassword(args.password),
    });

    return { message: "register success" };
  }

  static async login(args) {
    const { email, password } = args;

    if (!email) throw new Error("email is required");
    if (!password) throw new Error("password is required");

    const user = await userCollection.findOne({ email });
    if (!user) throw new Error("user not found");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error("invalid password");

    const access_token = signToken({
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
    });

    return { access_token };
  }

  static async getAllUsers() {
    return await userCollection.find().project({ password: 0 }).toArray();
  }

  static async getUserById(_id) {
    return await userCollection.findOne(
      { _id: new ObjectId(_id) },
      { projection: { password: 0 } }
    );
  }

  static async searchUsers(query) {
    const regex = new RegExp(query, "i");

    return await userCollection
      .find({
        $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
      })
      .project({ password: 0 })
      .toArray();
  }

  static async getFollowing(followerId) {
    const followings = await followCollection
      .aggregate([
        { $match: { followerId: new ObjectId(followerId) } },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "followings",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
            ],
          },
        },
        { $unwind: "$followings" },
        { $replaceRoot: { newRoot: "$followings" } },
      ])
      .toArray();

    return followings;
  }

  static async getFollowers(followingId) {
    const followers = await followCollection
      .aggregate([
        { $match: { followingId: new ObjectId(followingId) } },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "followers",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
            ],
          },
        },
        { $unwind: "$followers" },
        { $replaceRoot: { newRoot: "$followers" } },
      ])
      .toArray();

    return followers;
  }
}

module.exports = { User };
