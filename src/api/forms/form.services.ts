import {Connection, createConnection, getRepository, Repository} from 'typeorm';
import {verifyJwtToken} from '../auth/auth.services';
import { Form } from '../../entity/Form';

export const saveForm = async(formData):Promise<any>=>{

    const {authKey,data,title,desc,theme} = formData;

    return new Promise<any>(async (resolve,reject)=>{

        try{

            const authState = await verifyJwtToken(authKey);

            if(authState.status === 200){
                const {user_id} = authState.user;

                const repository:Repository<Form> = await getRepository(Form);
                const form = new Form();

                form.user_id = user_id;
                // console.log(data);

                form.data = JSON.stringify(data);
                form.title = title;
                form.description = desc;
                form.theme = theme;
                form.created_at = new Date();

                const saveData = await repository.save(form);


                return resolve({
                    status:200,
                    saveData:saveData
                });

            }else{
                return reject(authState);
            }

        }catch(err){
            console.log(err);
            return reject(err);
        }

    });

}

export const getFormbyUid = async(token:string):Promise<any> => {
    return new Promise<any> (async (resolve,reject)=>{
        try{

            const authState = await verifyJwtToken(token);

            if(authState.status == 200){

                const {user_id} = authState.user;


                const repo:Repository<Form> = await getRepository(Form);

                const forms:Form[] = await repo.createQueryBuilder().select('forms').from(Form,'forms').where('forms.user_id = :user_id',{user_id}).orderBy('forms.created_at','DESC').getMany();


                return resolve(forms);

            }else{
                return reject({
                    code:401,
                    message:'unauthorize user!'
                });
            }

        }catch(err){
            console.log(err);
            return reject(err);

        }
    });
}

export const getOne = async (form_id:string,token:string):Promise<any>=>{
    return new Promise<any>( async (resolve,reject)=>{

        try{

            const authState = await verifyJwtToken(token);
            if(authState.status === 200){

                const repo:Repository<Form> = await getRepository(Form);
                const form:Form = await repo.createQueryBuilder().select('forms').from(Form,'forms').where('forms.form_id = :form_id',{form_id}).getOne();


                return resolve({
                    code:200,
                    form:form
                });

            }else{
                return reject({
                    code:401,
                    message:'not a valid user'
                });
            }

        }catch(err){
            console.log(err);
            return reject(err);
        }
    });
}

export const editform = async (form_id:string,token:string,data:any,title:string,description:string):Promise<any> => {
  return new Promise<any>( async (resolve,reject) => {
    try{

      const authState = await verifyJwtToken(token);
      if(authState.status === 200){

        //valide user continue with updating
        const repo:Repository<Form> = await getRepository(Form);
        const updated_at:Date = new Date();
        await repo.createQueryBuilder().update(Form).set({data:JSON.stringify(data),created_at:updated_at,title:title,description:description}).where('form.form_id = :form_id',{form_id}).execute();

        return resolve({code:200,message:'Form updated!'});

      }else{
        return reject({code:401,reason:'The current session is either invalid or has expired!'})
      }

    }catch(err){
      console.log(err);
      return reject(err);

    }
  });
}
