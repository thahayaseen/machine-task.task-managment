import express from "express";
const app = express();
import { env, connectDB } from "@/config";
import morgon from "morgan";
import api from "@/router";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-handle.middleware";
import cores from "cors";
app.use(cores({
  origin: 'http://localhost:5173', // React app URL
  credentials: true, // allow cookies to be sent
}));

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgon("dev"));
app.use("/api", api);
app.use(errorHandler);
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log("Server started at " + env.PORT);
  });
};
startServer();
