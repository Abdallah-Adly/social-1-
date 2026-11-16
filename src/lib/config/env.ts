//schema >> validate proccess.env
// 1. errors >> missed fields
// 2. transform data in process.env
import {config} from "dotenv";
import {z}from 'zod';
config();

const schema= z.object({
    PORT:z.string().default('3000'),

    MONGODB_URL:z.string(),

    JWT_SECRET:z.string(),

    MAIL_USER:z.string().trim().toLowerCase(),
    MAIL_PASS:z.string(),

    GOOGLE_WEB_AUTH_CLIENT_ID:z.string(),

    REDIS_PORT:z.string().default('6379'),
    REDIS_HOST:z.string(),
    REDIS_PASSWORD:z.string(),

    MAILJET_API_KEY:z.string(),
    MAILJET_API_SECRET:z.string(),
    MAILJET_FORM_EMAIL:z.string(),
    MAILJET_FORM_NAME:z.string(),

})

const parsed=schema.parse(process.env)


export const env ={
    port:Number(parsed.PORT),
    db:{
        url:parsed.MONGODB_URL,
    },
    google:{
        webClientId:parsed.GOOGLE_WEB_AUTH_CLIENT_ID,
    },
    redis:{
        host:parsed.REDIS_HOST,
        port:Number(parsed.REDIS_PORT),
        password:parsed.REDIS_PASSWORD,
    },
    nodemailer:{
        user:parsed.MAIL_USER,
        password:parsed.MAIL_PASS,
    },
    jwt:{
        secret:parsed.JWT_SECRET,
    },
    mailjet:{
        apiKey:parsed.MAILJET_API_KEY,
        apiSecret:parsed.MAILJET_API_SECRET,
        fromEmail:parsed.MAILJET_FORM_EMAIL,
        fromName:parsed.MAILJET_FORM_NAME
    },
    payments:{},
    aws:{},

}