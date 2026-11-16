import {AppError} from "../error/error";
import {env} from "../config/env";
import jwt, {JwtPayload} from "jsonwebtoken";
import {NextFunction,Response,Request} from "express";


export function guard(req:Request, res:Response, next:NextFunction) {
    try {
        //logic of check token
        const token = req.cookies.access_token;
        if(!token) throw  new AppError('No token provided' ,403);
        req.user=jwt.verify(token, env.jwt.secret) as JwtPayload ;
        console.log(req.user);
        // req.user =payload
        next();
    }catch (err){
        next(err);
    }
}