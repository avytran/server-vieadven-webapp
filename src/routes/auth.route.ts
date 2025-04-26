import express from 'express';

import { createUserSchema, loginSchema } from '../entities/user.entity'
import validate from '../middlewares/validate.mdw';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validate(createUserSchema), authController.createAccount);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.renewToken)

export default router;