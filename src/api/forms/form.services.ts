import {Connection, createConnection, Repository} from 'typeorm';
import {verifyJwtToken} from '../auth/auth.services';
import { Form } from '../../entity/Form';

export const saveForm = async(formData):Promise<any>=>{

    const {authKey,data,title,desc,theme} = formData;

    return new Promise<any>(async (resolve,reject)=>{

        try{

            const authState = await verifyJwtToken(authKey);

            if(authState.status === 200){
                const {user_id} = authState.user;
                const connection = await createConnection();
                const repository:Repository<Form> = await connection.manager.getRepository(Form);
                const form = new Form();

                form.user_id = user_id;
                console.log(data);
                
                form.data = JSON.stringify(data);
                form.title = title;
                form.description = desc;
                form.theme = theme;

                const saveData = await repository.save(form);

                await connection.close();

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