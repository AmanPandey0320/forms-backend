import {Router} from 'express'
import {createForm} from './form.controller'
const router:Router = Router();

router.post('/create',createForm);

export {router as forms}