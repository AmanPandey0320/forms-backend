import {nanoid} from 'nanoid';
import {createHashPassword,createJwtToken,createUser} from './auth.services';

//signup controller
export const signup = async (req, res) => {
    const {name,google_token,email,password} = req.body;
    const id = nanoid(32);
    try {

        const hash = await createHashPassword(password);
        const token:string = await createJwtToken(email, password);
        const state = await createUser(email,hash,google_token,id,name);
        console.log(state);
        res.json({id,hash,token});

        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//signin controller
export const signin = async (req, res) => {
     res.send('signin')
}

//reset controller
export const reset = async (req, res) => {
    res.send('reset');
}

//verify controller
export const verify = async (req, res) => {
    res.send('verify');
}