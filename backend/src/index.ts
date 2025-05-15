import express from "express";
const app = express();
import { env, connectDB } from "@/config";
import morgon from "morgan";
import api from "@/router";
app.use(express.json());
app.use(morgon("dev"));
app.use("/api", api);
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log("Server started at " + env.PORT);
  });
};
startServer();
