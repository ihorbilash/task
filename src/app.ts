
import express from 'express';
import router from './routers/router';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as sessiontoSQL from 'express-session';
import MySQLSession from 'express-mysql-session';
import session from 'express-session';
import dotenv from 'dotenv';
import {config} from './db/sql.config'


const MySQLStore = MySQLSession(sessiontoSQL);
dotenv.config({path:'.env'});


const app = express();
const PORT = process.env.PORT || 3005;

app.use(bodyParser.json())
app.use(cookieParser('secret key'))
app.use(express.static('static'));

const sessionStore = new MySQLStore(config)

app.use(session({
    saveUninitialized: false,
    secret:"sicret",
    resave:false,
    store: sessionStore,
}));

declare module 'express-session'{
    interface SessionData{
        Id:number|undefined;
    }
}

app.use('/api', router)


app.listen(PORT, () => {
    console.log("Server has been started...");
});






