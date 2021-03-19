import {nanoid} from 'nanoid';
import { idText } from 'typescript';
import {createHashPassword,createJwtToken,createUser,verifyJwtToken,emailSignin,googleSignin,resetAccnt} from './auth.services';
import {updatePassword,updateEmail,updateName} from './auth.services';

import {emailClient} from '../../config/email';
import {Connection, createConnection, Repository} from 'typeorm';
import {User} from '../../entity/User';

const emailUrl = `http://localhost:${process.env.PORT}/api/auth/verification?uid=`;

//signup controller
export const signup = async (req, res) => {
    let {type,name,google_token,email,password} = req.body;
    let is_mail_verified = false;
    if(type === '00'){ //sign through email and password
        name = 'New froms user';
        google_token = nanoid(64);
        
    }else {
        is_mail_verified = true;
        password = nanoid(10);
    }
    const id = nanoid(32);
    try {

        const hash = await createHashPassword(password);
        const google_token_hash = await createHashPassword(google_token);
        const token:string = await createJwtToken(email, google_token_hash);
        const state = await createUser(email,hash,google_token_hash,id,name,is_mail_verified);

        // sand mail to the user

        if(type === '00'){
            const html = `<h1>Hi there!</h1><p>Verify your email to proceed further.</p><br><p>Click the link to proceed: <a href='${emailUrl+id}'>VERIFY ME</a></p>`
            await emailClient(email,html);
        }

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

//verify jwt controller
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
            res.status(200).json({verify_response});

        }catch(err){
            res.status(500).json({
                code: err.code,
                message: err.message
            });
        }

     }
}

//reset controller
export const reset = async (req, res) => {
     try{

        const state = await resetAccnt(req.body.email);
        res.status(200).json(state);

     }catch(err){
         res.status(500).json({code: err.code,message: err.message});
     }
}

//email verification
export const verification = async (req, res) => {

    const id = req.query.uid;

    try{

        const connection :Connection = await createConnection();
        const repository: Repository<User> =  await connection.getRepository(User);
        const user:User = await repository.createQueryBuilder().select('users').from(User,'users').where('users.user_id = :id',{id}).getOne();
        if(user.isverified){
            res.status(200).json({
                code:200,
                message:'email is already verified'
            });
            await connection.close();
        }else{

            await repository.createQueryBuilder().update(User).set({isverified:true}).where('user_id = :id',{id}).execute();
            await connection.close();

            res.send('verification done from ' + req.query.uid);

        }

    }catch (err) {
        console.log(err);
        res.status(500).json({
            code: err.code,
            message: err.message
        });
    }

}

//update controller
export const update = async (req,res) => {

    const {oldemail,newemail,oldpassword,newpassword,oldname,newname,email,password,name} = req.body; 

    if(oldemail && newemail){
        
        try {

            const state = await updateEmail(oldemail,newemail);
            res.status(200).json(state);

        }catch (err) {

            res.status(500).json({code: err.code,message: err.message});

        }
    }

    if(oldpassword && newpassword && email){

        try{

            const state = await updatePassword(oldpassword,newpassword,email);
            res.status(200).json(state);

        }catch(err){
            res.status(500).json({code:err.code,message:err.message})
        }
    }

    if(oldname && newname && email){
        
        try{

            const state = await updateName(oldname,newname,email);
            res.status(200).json(state);

        }catch (err) {

            res.status(500).json({code: err.code,message: err.message});

        }
    }
}