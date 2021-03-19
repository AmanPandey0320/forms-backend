import {Router} from 'express'
import {createForm,readForms,readForm} from './form.controller'
const router:Router = Router();

router.post('/create',createForm);
router.post('/getall',readForms);
router.post('/getone',readForm);

export {router as forms}