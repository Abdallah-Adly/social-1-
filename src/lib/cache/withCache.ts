import {cacheProvider} from "./init";
import {NextFunction,Request,Response} from "express";

export function withCache(ttl=3600){
    return async (req:Request, res:Response, next:NextFunction) => {
        //request
        // method + url
        let key = `${req.method}:${req.originalUrl}`
        const cached = await cacheProvider.get(key);
        if(cached){
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cached));
        }
        // interceptor
        // res.json () >> send client response
        //res.json () >> cache + send client response
        // get deep copy  from implementation res.json  before modify

        const originalJson = res.json.bind(res);
        res.json = (body)=>{
            if(res.statusCode >= 200 && res.statusCode < 300){
                // 1. cached
                 cacheProvider.set( key , JSON.stringify(body) , ttl)
                // 2. send response
                res.setHeader('X-Cache', 'MISS')
            }
            return originalJson(body);
        }
        next();

    }
 }