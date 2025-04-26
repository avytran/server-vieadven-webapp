import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import authService from "../services/auth.service";
import { decode } from 'punycode';

const SECRET_KEY = process.env.JWT_SECRET;

export default {
    createAccount: async (req: Request, res: Response) => {
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
                msg: error.message
            });
            return;
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const info = req.body
            const user = await authService.login(info)

            if (!user) {
                res.status(404).json({
                    message: 'User not found',
                    success: false
                })
                return;
            }

            const validPassword = await bcrypt.compare(info.password, user.password)

            if (!validPassword) {
                res.status(401).json({
                    message: 'Wrong password',
                })
                return;
            }

            const payload = {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                level: user.level
            };

            const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '2m' });
            const refreshToken = jwt.sign({ ...payload, token_type: 'refresh' }, SECRET_KEY, { expiresIn: '7d' });

            if (user && validPassword) {
                res.status(200).json({
                    message: 'Successfully',
                    accessToken,
                    refreshToken,
                    success: true
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error.message
            })
            return;
        }
    },
    renewToken: async (req: Request, res: Response) => {
        const refreshToken = req.headers['authorization'];

        if (!refreshToken) {
            res.status(401).json({
                message: 'Refresh token is missing',
                success: false,
            });
            return;
        }

        const token = refreshToken.split(' ')[1];

        try {

            const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

            if (decoded.token_type != 'refresh') {
                res.status(403).json({
                    message: 'Invalid token type. Refresh token required.',
                    success: false,
                })
                return;
            }

            const newAccessToken = jwt.sign(
                {
                    user_id: decoded.user_id,
                    name: decoded.name,
                    email: decoded.email,
                    avatar_url: decoded.avatar_url,
                    level: decoded.level
                },
                SECRET_KEY,
                { expiresIn: '2m' }
            );

            const newRefreshToken = jwt.sign(
                {
                    user_id: decoded.user_id,
                    name: decoded.name,
                    email: decoded.email,
                    avatar_url: decoded.avatar_url,
                    level: decoded.level,
                    token_type: 'refresh'
                },
                SECRET_KEY,
                { expiresIn: '7d' }
            )

            res.status(200).json({
                message: 'Token refreshed successfully',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                success: true
            });
            return;
        } catch (error) {
            res.status(401).json({
                message: 'Invalid or expired refresh token: ' + error.message,
                success: false,
            });
            return;
        }
    },
}