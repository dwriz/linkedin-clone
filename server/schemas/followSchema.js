const typeDefs = `#graphql
  type Follow {
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type FollowMessage {
    message: String
  }

  type Mutation {
    followUser(followingId: ID): FollowMessage
  }
`;

module.exports = { typeDefs };
