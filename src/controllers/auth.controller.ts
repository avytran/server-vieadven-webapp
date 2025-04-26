import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import authService from "../services/auth.service";


export default {
    createAccount: async(req: Request, res: Response) => {
        try {
            const user = req.body

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const account = {
                ...req.body,
                password: hashedPassword,
            };

            const createdPlayer = await authService.createAccount(account);

            res.status(201).json({
                message: "Successfully",
                data: createdPlayer
            })        
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Internal Server Error" + error.message
            });
            return;
        }
    }
}