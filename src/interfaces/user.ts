import { Document, ObjectId } from "mongoose"
import { Request } from "express"

type Role = "admin" | "employee" | "client"

export interface IUser extends Document {
  _id: ObjectId
  name: string
  email: string
  role: Role
  age: number
}

export interface IUserInput extends Request {
  _id: ObjectId
  input: {
    name: string
    email: string
    age: number
    role: Role
  }
}
