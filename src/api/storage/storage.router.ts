import {Router} from 'express';
import { uploads } from './storage.middleware';
import { uploadFile } from './storage.controller';

const router:Router = Router();

router.post('/upload',uploads,uploadFile);


export {router as storage};