import { toMs } from "../../../pkg/utils/time";
import {Response} from "express";

export function setCookies(res:Response, accessToken:string, refreshToken:string) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: toMs(1, "hours"),
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: toMs(7 * 24, "hours"),
    path: "api/auth/refresh-token",
  });
}
