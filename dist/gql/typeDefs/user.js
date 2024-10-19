const gql = String.raw;
export const userTypeDef = gql `
  #graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    age: Int!
  }

  input UserInput {
    name: String!
    email: String!
    age: Int!
  }

  type UserResponse {
    success: Boolean!
    message: String!
    data: [User]
    error: [String]
  }

  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(_id: ID!, input: UserInput!): User
    deleteUser(_id: ID!): User
  }

  type Subscription {
    userCreated: User!
    userUpdated: User!
    userDeleted: User!
  }
`;
