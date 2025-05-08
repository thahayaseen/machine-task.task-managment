import express from "express";
const app = express();
import { env } from "@/config/env.config";
import { connectDB } from "./config/mongo.config";
console.log(env.PORT,'nums is');

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log("Server started at " + env.PORT);
  });
};
startServer();
