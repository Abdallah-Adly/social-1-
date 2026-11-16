import {AppError} from "./error";
import {NextFunction,Response,Request} from "express";

export function globalErrorHandler (err:AppError,req:Request,res:Response,_next:NextFunction){

    if(err.isOperational){
        return res.status(err.statusCode).json({
            message:err.message,
            success:false,
        })
    }
    res.status(500).json({
        message:"something went wrong",
        success:false,
    })
}