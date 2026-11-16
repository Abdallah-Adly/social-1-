import crypto from "crypto";


export function generateOTPCode() {
    return  crypto.randomInt(100000, 999999).toString();
}