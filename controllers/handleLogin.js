import {prisma} from '../lib/prisma.js';
import {passport} from '../auth.js'

const handleLogin=async (req,res,next)=>{
    passport.authenticate('local',async (err,user,info)=>{
        if(err)
          return next(err);
        if(!user){
           return res.render("login", {
              user: null,
              formErrors: {
                general: { msg: "Invalid email or password" },
              },
              formValues: {
                email: req.body.email,
              },
            });
        }

         req.login(user,(err)=>{
          if(err){
           return next(err);
          }

          res.redirect('/dashboard');
         })
    })(req,res,next);
}


export default handleLogin;