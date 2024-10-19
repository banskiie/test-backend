import { mergeTypeDefs } from "@graphql-tools/merge"
import { userTypeDef } from './user.js'

const typeDefs = mergeTypeDefs([userTypeDef])

export default typeDefs
