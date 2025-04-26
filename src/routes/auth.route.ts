import express from 'express';

import { createUserSchema } from '../entities/user.entity'
import validate from '../middlewares/validate.mdw';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validate(createUserSchema), authController.createAccount)

export default router;