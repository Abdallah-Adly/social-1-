import {AppError} from "../../lib/error/error";

export const otpExpired =new AppError('OTP Expired, please try resend otp.',404);//404
export const invalidOtp =new AppError('invalid otp',400);//400
export const invalidPassword=new AppError('invalid password',403);//403

