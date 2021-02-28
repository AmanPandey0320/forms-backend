import {Router} from 'express';
import {signup,signin,reset,verify} from './auth.controller';
const router = Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/verify',verify)
router.post('/reset',reset);

export{router as auth}