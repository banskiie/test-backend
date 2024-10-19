import User from "../../schemas/user.js"
import { Request } from "express"
import { IUser, IUserInput } from "../../interfaces/user.js"
import { GraphQLError } from "graphql"
import { PubSub } from "graphql-subscriptions"

const pubSub = new PubSub()

const userResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => {
      const users = await User.find()
      if (!users) throw new GraphQLError("Users not found.")

      return users
    },
    user: async (
      _: any,
      { _id }: IUserInput,
      request: Request
    ): Promise<IUser> => {
      try {
        const user = await User.findById(_id)
        if (!user) throw new GraphQLError("User not found.")
        return user
      } catch (error: any) {
        throw error
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: IUserInput,
      request: Request
    ): Promise<IUser> => {
      const { name, email, age } = input
      try {
        const user = await User.create({
          name,
          email,
          age,
        })
        pubSub.publish("USER_CREATED", {
          userCreated: user,
        })
        return user
      } catch (error: any) {
        throw error
      }
    },
    updateUser: async (
      _: any,
      { _id, input }: IUserInput,
      request: Request
    ): Promise<IUser> => {
      const { name, email, age } = input
      try {
        const user = await User.findById(_id)
        if (!user) {
          throw new GraphQLError("User not found.")
        }

        user.name = name
        user.email = email
        user.age = age
        await user.save()

        return user
      } catch (error: any) {
        throw error
      }
    },
    deleteUser: async (
      _: any,
      { _id }: IUserInput,
      request: Request
    ): Promise<IUser> => {
      try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) throw new GraphQLError("User not found.")
        return user
      } catch (error: any) {
        throw error
      }
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(["USER_CREATED"]),
    },
    userUpdated: {
      subscribe: () => pubSub.asyncIterator(["USER_UPDATED"]),
    },
    userDeleted: {
      subscribe: () => pubSub.asyncIterator(["USER_DELETED"]),
    },
  },
}

export default userResolvers
