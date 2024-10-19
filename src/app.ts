import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@apollo/server/express4"
import resolvers from "./gql/resolvers/index.js"
import typeDefs from "./gql/typeDefs/index.js"
import { ApolloServer } from "@apollo/server"

import express from "express"
import http from "http"
import cors from "cors"

import bodyParser from "body-parser"
import mongoose from "mongoose"

import { makeExecutableSchema } from "@graphql-tools/schema"
import { useServer } from "graphql-ws/lib/use/ws"
import { WebSocketServer } from "ws"

const MONGODB_URI =
  "mongodb+srv://root:WaOrwznWtnuHIdY5@test.qfxx9.mongodb.net/testdb?retryWrites=true&w=majority&appName=Test"
const IP_ADDRESS = "192.168.6.56"
const PATH = "/graphql"
const PORT = 90

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // '*' IF ALLOW ALL
  res.setHeader("Access-Control-Allow-Methods", "*") // '*' IF ALLOW ALL
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})

const httpServer = http.createServer(app)

// SUBSCRIPTION WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: PATH,
})

const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
})

await server.start()

app.use(
  PATH,
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      userId: req.headers.userId,
      userRole: req.headers.userRole,
      isAuth: req.headers.isAuth ? true : false,
    }),
  })
)

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    httpServer.listen(PORT, IP_ADDRESS, () => {
      console.log(`Server running on http://${IP_ADDRESS}:${PORT}`)
    })
  })
  .catch((err) => console.log(err))
