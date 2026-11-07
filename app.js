import express from 'express';
import path from 'node:path';
import {session,passport} from './auth.js';
import homeRouter from './routes/home.js';
import dashboardRouter from './routes/dashboard.js';
import logoutRouter from './routes/logout.js'
import 'dotenv/config';

const app=express();
const __dirname=import.meta.dirname;
const PORT=process.env.PORT || 3000;


app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

app.use(session);
app.use(passport.session())


app.use('/',homeRouter);
app.use('/dashboard',dashboardRouter);
app.use('/logout',logoutRouter);
app.listen(PORT,(err)=>{
    if(err){
    console.error(err)
    return
    }
    console.log('Listening to port',PORT);
})


// Ninja!Pizza#420