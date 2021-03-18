import {Router} from 'express';
import {auth} from './auth/auth.router';
import {forms} from './forms/form.router';
const router:Router = Router();

router.use('/auth',auth);
router.use('/form',forms)

export {router as api};