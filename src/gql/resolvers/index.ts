import { mergeResolvers } from "@graphql-tools/merge"

import userResolvers from "./user.js"

const resolvers = mergeResolvers([userResolvers])

export default resolvers
