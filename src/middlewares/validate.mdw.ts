import Ajv from "ajv";
import addFormats from 'ajv-formats';
import { Response, Request, NextFunction } from "express";

export default function (schema) {
    return function validate(req: Request, res: Response, next: NextFunction) : Promise<void>{
        const ajv = new Ajv({ allErrors: true });
        addFormats(ajv);
        const valid = ajv.validate(schema, req.body)
        if (!valid){
            console.log(ajv.errors);
            res.status(400).json(ajv.errors);
            return;
        }
        next();
    }
}