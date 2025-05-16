import jwt from "jsonwebtoken";
import { env } from "@/config";
import { createHttpError } from "./httpError.utill";
import { HttpStatus } from "@/constants";

const ACCESS_KEY = env.JWT_ACCESS_SECRET as string;
const REFRESH_KEY = env.JWT_REFRESH_SECRET as string;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(payload: object): string {
  console.log("payload", { payload });
  return jwt.sign(payload, ACCESS_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: object): string {
  console.log("payload", { payload });
  return jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_KEY);
  } catch (err) {
    // console.log(err)
    throw createHttpError(
      HttpStatus.UNAUTHORIZED,
      err instanceof Error ? err.message : "Unable to varify token"
    );
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_KEY);
  } catch (err) {
    console.error(err);
    return null;
  }
}
