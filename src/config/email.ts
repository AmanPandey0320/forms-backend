import * as nodemailer from "nodemailer";
const sgMail = require('@sendgrid/mail');
const {google} = require("googleapis");
require("dotenv").config()
const sender_email_id = process.env.email_id;
// const sender_password_id = process.env.email_password;

// const oAuth_client = process.env.oAuth_client;
// const oAuth_secret = process.env.oAuth_secret;
// const oAuth_refresh_token = process.env.oAuth_refresh_token;
// const redirect_uri = process.env.redirect_uri;

// const oAuth2Client = new google.auth.OAuth2(oAuth_client, oAuth_secret,redirect_uri);
// oAuth2Client.setCredentials({refresh_token:oAuth_refresh_token});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const emailClient = (email: string,html: string):Promise<Object> => {

    return new Promise<Object>(async (resolve,reject) =>{
        
        try{

            //nodemailer

            // const access_token = await oAuth2Client.getAccessToken();

            // let transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //     type:'OAuth2',
            //     user: sender_email_id, // generated ethereal user
            //     clientId: oAuth_client, 
            //     clientSecret:oAuth_secret,
            //     refreshToken:oAuth_refresh_token,
            //     accessToken:access_token
            //     },
            // });

            // let info = await transporter.sendMail({
            //     from: 'Forms support', // sender address
            //     to: email, // list of receivers
            //     subject: "Hello", // Subject line
            //     html: html, // plain text body
            // });

            // // console.log(info);
            // return resolve(info);

            //sgmail

            const msg = {
                to: email,
                from: sender_email_id, // Use the email address or domain you verified above
                subject: 'Sending with Twilio SendGrid is Fun',
                html: html,
            };

            const info = await sgMail.send(msg);
            return resolve(info);

        }catch(err){
            console.log(err);
            return reject(err);
        }
    });

}