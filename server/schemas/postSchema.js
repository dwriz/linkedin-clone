const typeDefs = `#graphql
  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type PostMessage {
    message: String
  }

  type Query {
    posts: [Post]
    post(_id: ID): Post
  }

  input NewPostInput {
    content: String
    tags: [String]
    imgUrl: String
  }

  input NewCommentInput {
    postId: ID
    content: String
  }

  input NewLikeInput {
    postId: ID
  }

  type Mutation {
    addPost(newPost: NewPostInput): PostMessage
    addComment(newComment: NewCommentInput): PostMessage
    addLike(newLike: NewLikeInput): PostMessage
  }
`;

module.exports = { typeDefs };
