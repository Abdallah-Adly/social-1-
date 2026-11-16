    import {JwtPayload} from "jsonwebtoken";
    import {IUser} from "../../app/user/interface/user.interface";
declare module 'express-serve-static-core'{

    // case 1
    // interface Request {
    //     user?:{sub:string,email:string,role:string};
    // }


    // case 2
    //reopen
    interface Request {
        user?: Partial<IUser> & JwtPayload;
    }
}