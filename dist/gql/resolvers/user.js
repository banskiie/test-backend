import User from "../../schemas/user.js";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
const pubSub = new PubSub();
const userResolvers = {
    Query: {
        users: async () => {
            const users = await User.find();
            if (!users)
                throw new GraphQLError("Users not found.");
            return users;
        },
        user: async (_, { _id }, request) => {
            try {
                const user = await User.findById(_id);
                if (!user)
                    throw new GraphQLError("User not found.");
                return user;
            }
            catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createUser: async (_, { input }, request) => {
            const { name, email, age } = input;
            try {
                const user = await User.create({
                    name,
                    email,
                    age,
                });
                pubSub.publish("USER_CREATED", {
                    userCreated: user,
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        },
        updateUser: async (_, { _id, input }, request) => {
            const { name, email, age } = input;
            try {
                const user = await User.findById(_id);
                if (!user) {
                    throw new GraphQLError("User not found.");
                }
                user.name = name;
                user.email = email;
                user.age = age;
                await user.save();
                return user;
            }
            catch (error) {
                throw error;
            }
        },
        deleteUser: async (_, { _id }, request) => {
            try {
                const user = await User.findByIdAndDelete(_id);
                if (!user)
                    throw new GraphQLError("User not found.");
                return user;
            }
            catch (error) {
                throw error;
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
};
export default userResolvers;
