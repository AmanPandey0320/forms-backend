import {nanoid} from 'nanoid';
import { idText } from 'typescript';
import {createHashPassword,createJwtToken,createUser,verifyJwtToken,emailSignin,googleSignin} from './auth.services';

//signup controller
export const signup = async (req, res) => {
    let {type,name,google_token,email,password} = req.body;
    if(type === '00'){
        name = 'New froms user';
        google_token = nanoid(64);
    }else {
        password = nanoid(10);
    }
    const id = nanoid(32);
    try {

        const hash = await createHashPassword(password);
        const google_token_hash = await createHashPassword(google_token);
        const token:string = await createJwtToken(email, google_token_hash);
        const state = await createUser(email,hash,google_token_hash,id,name);
        // console.log(state);
        res.send({id,token})

        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//signin controller
export const signin = async (req, res) => {

    let {type,email,password,google_token} = req.body;

    try{
        if(type === '00'){
            //sign in via email and password
            const status = await emailSignin(email, password);
            res.json(status);
            
        }else{
            //sign in via google_token
            const status = await googleSignin(google_token,email);
            res.json(status);
        }
    }catch(err){
        res.status(err.code).json(err);
    }
    
}

//verify controller
export const verify = async (req, res) => {
     const authKey = req.body.authKey;
     if(!authKey){
         res.status(401).json({
             message: 'Authorization unsuccessfull! \n Please sign up!',
             path:"/signup"
         });
     }else{

        try{

            const verify_response = await verifyJwtToken(authKey);
            res.status(200).json({verify_response,path:"/home"});

        }catch(err){
            res.status(500).json(err);
        }

     }
}

//reset controller
export const reset = async (req, res) => {
    res.send('reset');
}

