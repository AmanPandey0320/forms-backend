import {Router} from 'express';
import {signup,signin,reset,verify,verification} from './auth.controller';
const router = Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/verify',verify);
router.get('/verification',verification);
router.post('/reset',reset);

export{router as auth}