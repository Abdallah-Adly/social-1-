import bcrypt from "bcrypt";
import argon2 from "argon2";

export async function hashPassword(password:string) {
    return  argon2.hash(password);
}




export async function comparePassword(password:string , hashedPassword:string) {
    return  argon2.verify(hashedPassword,password);
}