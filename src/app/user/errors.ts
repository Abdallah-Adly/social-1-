import {AppError} from "../../lib/error/error";

export const userNotExist = new AppError('User Not Exist.',404);//404
export const userExistError =new AppError('User already exists',409);//409
export const youAlreadyVerified =new AppError('You Already Verified.',400);//400
export const userNotVerified=new AppError('User Not Verified',403);//403