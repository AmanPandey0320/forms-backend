import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import * as bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import {createConnection} from 'typeorm';
import {User} from '../../entity/User'
dotenv.config();
const saltRounds:number = parseInt(process.env.saltRounds);
const jwt_key:string = process.env.jwt_key;

export const createJwtToken = async (email: string, google_token:string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) =>{
        
        try{

            const token = await jwt.sign({email, google_token},jwt_key,{expiresIn:'7d'});
            return resolve(token);

        }catch(err){
            console.log(err);
            return reject(err);
            
        }
    });
}

export const createHashPassword = async (password: string) : Promise<string> => {
    const temp_id = await nanoid(32);

    return new Promise<string>(async (resolve, reject) =>{
        

        try{

            const salt:string = await bcrypt.genSalt(saltRounds);
            const hash:string = await bcrypt.hash(password, salt);
            return resolve(hash);

        }catch(err){
            console.log(err);
            return reject(err);
        }

    });
}

export const createUser = (email_id:string,password:string,google_token:string,user_id:string,name:string): Promise<boolean>=>{

    return new Promise<boolean>(async (resolve, reject) =>{
        const user:User = new User();
        user.email_id = email_id;
        user.password = password;
        user.google_id = google_token;
        user.name = name;
        user.user_id = user_id;

        createConnection().then( async (connection)=>{

            try {

                const repository =  await connection.manager.getRepository(User);
                await repository.save(user);
                connection.close();
                return  resolve(true);
                
            } catch (err) {
                console.log(err);
                connection.close();
                return reject(err);
                
            }

            

        }).catch(err=>{

            console.log(err);
            return reject(err);

        });
    })

}