import {Router} from 'express';
import {auth} from './auth/auth.router';
import {forms} from './forms/form.router';
import { response } from './responses/response.router';
const router:Router = Router();

router.use('/auth',auth);
router.use('/form',forms);
router.use('/response',response);

export {router as api};