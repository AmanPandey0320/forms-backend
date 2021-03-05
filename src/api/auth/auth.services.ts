import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import * as bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import {Connection, createConnection, Repository} from 'typeorm';
import {User} from '../../entity/User';
import {emailClient} from '../../config/email';

dotenv.config();
const saltRounds:number = parseInt(process.env.saltRounds);
const jwt_key:string = process.env.jwt_key;

export const createJwtToken = async (email: string, google_token:string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) =>{
        
        try{

            const token = await jwt.sign({email, google_token},jwt_key,{expiresIn:'1d'});
            return resolve(token);

        }catch(err){
            console.log(err);
            return reject(err);
            
        }
    });
}

export const createHashPassword = async (password: string) : Promise<string> => {

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

export const createUser = (email_id:string,password:string,google_token:string,user_id:string,name:string,isverified:boolean): Promise<boolean>=>{

    return new Promise<boolean>(async (resolve, reject) =>{
        const user:User = new User();
        user.email_id = email_id;
        user.password = password;
        user.google_id = google_token;
        user.name = name;
        user.user_id = user_id;
        user.isverified = isverified;

        createConnection().then( async (connection)=>{

            try {

                const repository: Repository<User>=  await connection.manager.getRepository(User);
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

export const verifyJwtToken = (jwt_token:string) : Promise<Object> =>{
    return new Promise<Object> (async (resolve, reject) =>{
        
        try{
            
            const decode:any = await jwt.verify(jwt_token,jwt_key);

            // console.log(decode);
            
            
            const {email, google_token} = decode;

            const connection:Connection = await createConnection();
            const  repository: Repository<User> = await connection.manager.getRepository(User);

            const user:User = await repository.createQueryBuilder().select("users").from(User,"users").where("users.email_id = :email_id",{email_id:email}).getOne();
            
            // console.log(result);

            connection.close();

            const jwt_token_new = await createJwtToken(user.email_id,user.google_id);
            
            if(!user){
                return resolve({
                    status:404,
                    message:"user not found!",
                    user:{}
                })
            }else{
                if(google_token === user.google_id){

                    return resolve({
                        status:200,
                        message:"Welcome!",
                        token:jwt_token_new,
                        user: user
                    });

                }else{
                    return resolve({
                        status:401,
                        message:"invalid user",
                        user:{}
                    });
                }
            }

        }catch(err){
            console.log(err);
            return reject(err);
            
        }
    });
}

export const emailSignin = (email:string,password:string) : Promise<Object>=>{

    return new Promise<Object> (async (resolve, reject) =>{

        let code,message,path;

        try{

            const connection = await createConnection();
            const repository: Repository<User> =  await connection.manager.getRepository(User);
            const user:User = await repository.createQueryBuilder().select('users').from(User,"users").where("users.email_id = :email_id",{email_id:email}).getOne();
            connection.close();

            if(!user){
                //no user existes with this email id 
                code = 404,message='no such user exists with this email-id!',path='/signup';
                return reject({code,message,path});
            }else if(user.isverified){
                //user exists with this email id
                const isvalidCred = await bcrypt.compare(password,user.password);

                if(isvalidCred){
                    //user authenticated
                    code = 200,message=user.user_id,path='/home';
                    const token =  await createJwtToken(email,user.google_id)
                    return resolve({
                        code:code,
                        id:message,
                        path:path,
                        token:token,
                    });
                }else{
                    //user not authenticated
                    code = 401,message='Sign-in failed! either email or password is incorrect.',path='/signin';
                    return reject({code,message,path});
                }
            }else{
                code=401,message='email not verified! Please verify your email first.';
                return reject({code,message});
            }
            

        }catch(err){
            console.log(err);
            code = err.code,message=err.message,path='/error';
            
            return reject({code,message,path});
        }

    });

}

export const googleSignin = (google_token:string,email :string):Promise<Object> => {

    return new Promise<Object> (async (resolve, reject)=>{

        let code,message,path;

        try{

            const connection: Connection = await createConnection();
            const repository:Repository<User> =  await connection.getRepository(User);
            const user:User = await repository.createQueryBuilder().select('users').from(User,"users").where("users.email_id = :email_id",{email_id:email}).getOne()
            connection.close();

            if(!user){
                //no such user exists
                code = 404,message='no such user exists!',path = '/signup';
                return reject({code,message,path});
            }else{
                //user exists
                
                const isvalidCred:boolean = await bcrypt.compare(google_token,user.google_id);

                if(isvalidCred){
                    //user authenticated
                    code = 200,message=user.user_id,path='/home';
                    const token =  await createJwtToken(email,user.google_id)
                    return resolve({
                        code:code,
                        id:message,
                        path:path,
                        token:token,
                    });
                }else{
                    //user unautheticated
                    code = 401, message='Signin failed! Try signing up again',path='/signup';
                    return reject({code,message,path});
                }
            }

        }catch(err){
            console.log(err);
            code = err.code,message = err.message,path='/error';
            return reject({code,message,path});
        }

    });

}


export const resetAccnt = (email:string):Promise<Object> => {

    return new Promise<Object>(async (resolve, reject) => {

        try{

            const connection:Connection = await createConnection();
            const repository:Repository<User> = await connection.manager.getRepository(User);
            const user:User = await repository.createQueryBuilder().select('users').from(User,"users").where('users.email_id = :email',{email}).getOne();

            // console.log(user);
            

            if(!user){
                connection.close();
                throw new Error('unauthorised access');
            }

            if(user.isverified){
                //send a new password to user
                const newPassword = await nanoid(10);
                const hashPassword = await createHashPassword(newPassword);
                await repository.createQueryBuilder().update(User).set({password:hashPassword}).where('users.user_id = :user_id',{user_id:user.user_id}).execute();

                const html = `<p>Hello ${user.name}</p><p>We have recieved a request to reset your password.</p><p>Your new password is as follows <strong>${newPassword}</strong></p>`;

                await emailClient(email,html);
                connection.close();
                return resolve({code:200,message:'email sent! check your mailbox'});


            }else{
                //user not verified
                const emailUrl = `http://localhost:${process.env.PORT}/api/auth/verification?uid=`;

                const html = `<h1>Hi there!</h1><p>Verify your email to proceed further.</p><br><p>Click the link to proceed: <a href='${emailUrl+user.user_id}'>VERIFY ME</a></p>`
                await emailClient(email,html);
                connection.close();
                return resolve({code:200,message:'first verify your email then only you can reset your password'});
            }

            connection.close();

        }catch(err){
            console.log(err);
            return reject(err);
        }

    });

}