import express from 'express';
import cors from 'cors';
// for all the http request
import morgan from 'morgan';

import router from './router/route.js';
import connect from './database/conn.js';

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
// less hackers know about my stack
app.disable('x-powered-by');

// port number on which I will be handling my backend
const port = 8080;

// http get request
app.get('/', (req,res) => {
    res.status(201).json("Home GET Request");
})

// API routes 
// api is a endpoint for all other routes
app.use('/api', router)

// start server only when we have valid db connection
//connect fn. will return a promise so we will use 'then' here
//inside then we will call a callback function with try and catch
connect().then( () => {
    try{
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    }catch(error){
        console.log('Cannot connect to the Server')
    }
}).catch(error => {
    console.log("Invalid database Connection !!!")
})

