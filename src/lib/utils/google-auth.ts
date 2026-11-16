import {OAuth2Client} from "google-auth-library";
import {AppError} from "../error/error";
import {env} from "../config/env";

const client = new OAuth2Client({client_id: env.google.webClientId});

export async function verifyGoogleToken(idToken:string) {
    try {
        const ticket= await client.verifyIdToken({
            idToken: idToken ,
            audience:env.google.webClientId
        });

        return ticket.getPayload(); //{id,name,email,profile,...}
    }catch (err){
        throw new AppError('invalid google token', 403);
    }
}