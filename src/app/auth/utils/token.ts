import jwt, {JwtPayload} from "jsonwebtoken";
import {toMs} from "../../../pkg/utils/time.js";
import {env} from "../../../lib/config/env.js";
import {IUser} from "../../user/interface/user.interface";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";

export function generateToken(payload:TUserPayload) {
    return  jwt.sign(
        payload,
        env.jwt.secret,
        {expiresIn:toMs(1,'hours')});
}

export function generateAccessToken(payload:TUserPayload) {
    return  jwt.sign(
        payload,
        env.jwt.secret,
        {expiresIn:toMs(1,'hours')});
}

export function generateRefreshToken(payload:TUserPayload) {
    return  jwt.sign(
        payload,
        env.jwt.secret,
        {expiresIn:toMs(1,'hours')});
}

