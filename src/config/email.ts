import * as nodemailer from "nodemailer";
require("dotenv").config()
const sender_email_id = process.env.email_id;
const sender_password_id = process.env.email_password;



export const emailClient = (email: string,html: string):Promise<Object> => {

    return new Promise<Object>(async (resolve,reject) =>{
        // const testAccount = await nodemailer.createTestAccount();

        // console.log(sender_email_id);
        

        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
            user: sender_email_id, // generated ethereal user
            pass: sender_password_id, // generated ethereal password
            },
        });

        try{

            let info = await transporter.sendMail({
                from: 'Forms support', // sender address
                to: email, // list of receivers
                subject: "Hello", // Subject line
                html: html, // plain text body
            });

            // console.log(info);
            return resolve(info);
            

        }catch(err){
            console.log(err);
            return reject(err);
        }
    });

}