import multer, {diskStorage} from "multer";
import crypto from "node:crypto";
import {AppError} from "../../lib/error/error.ts";
import {allowedFields} from "./file.validation.js";

//storage:
//1. disk[hdd].
//     folder >>
//     filename >>
//2.memory[ram].

//if you want storage in ram.
// multer({
//     storage: memoryStorage()
// })

//if you want storage in disk.
export function multerUpload(allowTypes){
    return multer({
        fileFilter:(req,file,cb)=>{
            if(!allowTypes.includes(file.mimetype)){
                return cb(new AppError('invalid file format',400),false);
            }
            cb(null, true);
        },
        storage: diskStorage({
            destination: 'uploads',
            filename:(req,file,cb)=>{
                console.log(file); //{fieldname, size , mimetype , encoding ,originalname}

                cb(null,`${crypto.randomUUID()}-${file.originalname}`);
            }


})
})
}

export function uploadSingleFile(fieldName, allowTypes=allowedFields.images){
    return  multerUpload(allowTypes).single(fieldName);
}

export function uploadFilesArray(fieldName){
    return multerUpload().array(fieldName);
}

export function uploadFields(fields){
    return multerUpload().fields(fields);
}