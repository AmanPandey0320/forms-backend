import {createConnection} from "typeorm";
import * as express from 'express';
import * as http from "http";
import * as dotenv from "dotenv";
import {api} from './api/api.router';

dotenv.config();
const port = process.env.PORT;
const app:express.Application = express();
const server: http.Server = http.createServer(app); 


app.use(express.json());
app.use('/api',api);


server.listen(port,()=>{
    console.log('server listening on port :'+port);
    
});