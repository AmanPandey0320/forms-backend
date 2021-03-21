import {Connection, createConnection, getRepository, Repository} from 'typeorm';
import {verifyJwtToken} from '../auth/auth.services';
import { Response } from '../../entity/Response';

export const createResponse = async (token,data):Promise<any>=>{
    const { form_id,response } = data;

    return new Promise<any> (async (resolve,reject)=>{

        try{

            const authState = await verifyJwtToken(token);

            if(authState.status === 200){

                const {user_id} = authState.user;
                const res:Response = new Response();

                res.user_id = user_id;
                res.form_id = form_id;
                res.response = response;
                res.edited_at = new Date();
                res.submitted_at = new Date();

                
                const repo :Repository<Response> = await  getRepository(Response);
                const resState = await repo.save(res);

                return resolve({resState:resState,code:200});

            }else{
                return reject({
                    code:401,
                    message:'user not verified!'
                })
            }

        }catch(err){
            console.log(err);
            return reject(err);
        }

    });

}