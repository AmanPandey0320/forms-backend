import {saveForm,getFormbyUid,getOne, editform} from './form.services';

export const createForm = async (req,res)=>{
    // console.log(JSON.stringify(req.body.authKey));
    try{

        const sendState = await saveForm(req.body);

        res.send(sendState);

    }catch(err){
        res.send('err');
    }
    // res.send('data');
}

export const readForms = async (req,res)=>{
    try{

        const {authKey} = req.body;

        const formState = await getFormbyUid(authKey);

        res.json({formState});


    }catch(err){
        res.status(500).json(err);
    }
}

export const readForm = async (req,res)=>{

    const {form_id,authKey} = req.body;

    try{

        const formState  = await getOne(form_id,authKey) ;

        if(formState.code === 200){
            res.json(formState.form);
        }else{
            res.status(formState.code).json(formState);
        }

    }catch(err){
        res.status(500).json(err);
    }

}

export const editForm = async (req,res)=>{
    const {authKey,form_id,data} = req.body;
    
    try{

        const editState = await editform(form_id,authKey,data);
        if(editState.code === 200){
            //edit done
            res.json(editState);

        }else{
            res.status(editState.code).json(editState);
        }

    }catch(err){
        res.status(500).json(err);
    }
}