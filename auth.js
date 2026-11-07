import expressSession from 'express-session';
import passport from 'passport';
import {Strategy as LocalStrategy} from'passport-local';
import {prisma} from './lib/prisma.js';
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from 'bcryptjs';

const session = expressSession({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    checkPeriod: 15 * 60 * 1000,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 15 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

const localStrategy=new LocalStrategy({
  usernameField:'email',
  passwordField:'password'
},async (email,password,done)=>{
   try {
     const user=await prisma.user.findFirst({
      where:{
          email:email
      }
     })
     if(!user){
      return done(null,false,{message:"Incorrect email"})
     }
     const correctPassword=await bcrypt.compare(password,user.password);
     if(!correctPassword){
      return done(null,false,{message:"Incorrect password"})
     }
     done(null,user);
   }catch(err){
      done(err);
   }
})

passport.use(localStrategy);

passport.serializeUser(async (user,done)=>{
     done(null,user.id)
})

passport.deserializeUser(async (userId,done)=>{
   try{
    const user=await prisma.user.findFirst({
      where:{
         id:userId
      }
    })
    if(!user)
        return done(null,false)

    done(null,user);
   }catch(err){
    done(err)
   }
})

export {session,passport};