import {saveForm} from './form.services';

export const createForm = async (req,res)=>{
    console.log(JSON.stringify(req.body.authKey));
    try{

        const sendState = await saveForm(req.body);

        res.send(sendState);

    }catch(err){
        res.send('err');
    }
    // res.send('data');
}