import { JWTPayload } from '../types/auth';

export { };

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
} 