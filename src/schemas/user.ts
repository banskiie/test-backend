import { model, Schema } from "mongoose"
import { IUser } from "../interfaces/user.js"

const Roles = ["admin", "employee", "client"]

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: Roles },
  age: { type: Number, required: true },
})

export default model<IUser>("User", userSchema)
