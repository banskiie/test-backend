import { mergeTypeDefs } from "@graphql-tools/merge";
import { userSchema } from './user.js';
const typeDefs = mergeTypeDefs([userSchema]);
export default typeDefs;
