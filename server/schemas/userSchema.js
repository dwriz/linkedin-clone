const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  type RegisterMessage {
    message: String
  }

  type LoginPayload {
    access_token: String
  }

  type Query {
    users: [User]
    user(_id: ID): User
    self: User
    following: [User]
    followers: [User]
    searchUsers(query: String): [User]
  }

  input NewUser {
    name: String
    username: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Mutation {
    register(newUser: NewUser): RegisterMessage
    login(loginInput: LoginInput): LoginPayload
  }
`;

module.exports = { typeDefs };
