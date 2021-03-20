import { createResponse } from "./response.services";

export const submit = async (req,res)=>{

    const { authKey,data} = req.body;

    try{

        const saveState = await createResponse(authKey,data);
        
        if(saveState.code === 200){
            res.json(saveState.resState);
        }else{
            res.status(500).json(saveState.resState);
        }

    }catch(err){
        res.status(500).json(err);
    }

}