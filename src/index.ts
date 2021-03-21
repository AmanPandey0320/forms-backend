import {createConnection} from "typeorm";
import * as express from 'express';
import * as http from "http";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as cookieparser from "cookie-parser";
import {api} from './api/api.router';


dotenv.config();
const port = process.env.PORT || 4000;
const app:express.Application = express();
const server: http.Server = http.createServer(app); 

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 ,// For legacy browser support
    credentials:true
}

try{

    createConnection();

}catch(err){
    console.log(err);
    
}

app.use(async function(req, res, next) {
    res.header('Access-Control-Allow-Origin','http://localhost:3000' );
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

app.use(cors(corsOptions));
app.use(cookieparser());
app.use(express.json());
app.use('/api',api);


server.listen(port,()=>{
    console.log('server listening on port :'+port);
    
});