import fs from "fs"
import jose from "node-jose"
import dotenv from "dotenv"

import User from "../schemas/user.js"

import { Request, Response, NextFunction } from "express"
// import { AuthenticatedRequest } from "../interfaces/auth"
