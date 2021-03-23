import {Router} from 'express'
import {createForm,readForms,readForm, editForm} from './form.controller'
const router:Router = Router();

router.post('/create',createForm);
router.post('/getall',readForms);
router.post('/getone',readForm);
router.post('/editform',editForm);

export {router as forms}
