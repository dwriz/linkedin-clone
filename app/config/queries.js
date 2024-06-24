import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      access_token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($newUser: NewUser) {
    register(newUser: $newUser) {
      message
    }
  }
`;

export const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      author {
        _id
        name
        username
        email
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST = gql`
  query Post($id: ID) {
    post(_id: $id) {
      _id
      content
      tags
      imgUrl
      author {
        _id
        name
        username
        email
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($newPost: NewPostInput) {
    addPost(newPost: $newPost) {
      message
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($newComment: NewCommentInput) {
    addComment(newComment: $newComment) {
      message
    }
  }
`;

export const GET_SELF = gql`
  query Self {
    self {
      _id
      name
      username
      email
      password
    }
  }
`;

export const ADD_LIKE = gql`
  mutation AddLike($newLike: NewLikeInput) {
    addLike(newLike: $newLike) {
      message
    }
  }
`;

export const GET_FOLLOWING = gql`
  query Following {
    following {
      _id
      name
      username
      email
      password
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query Followers {
    followers {
      _id
      name
      username
      email
      password
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String) {
    searchUsers(query: $query) {
      _id
      name
      username
      email
      password
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followingId: ID!) {
    followUser(followingId: $followingId) {
      message
    }
  }
`;
