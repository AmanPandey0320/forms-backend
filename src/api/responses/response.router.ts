import {Router} from 'express'
import { submit } from './response.controller';

const router = Router();

router.post('/submit',submit);


export {router as response}