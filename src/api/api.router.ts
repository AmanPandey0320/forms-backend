import {Router} from 'express';
import {auth} from './auth/auth.router';
const router:Router = Router();

router.use('/auth',auth);

export {router as api};