import bcrypt from "bcryptjs";
import {prisma} from '../lib/prisma.js';

const createUser=async(req,res,next)=>{
     try{
      const formData=req.body;
      const hashedPassword=await bcrypt.hash(formData.password,10);
      const hashedSecurityAnswer=await bcrypt.hash(formData.securityAnswer,10);
      await prisma.user.create({
         data:{
            firstName:formData.firstName,
            lastName:formData.lastName,
            email:formData.email,
            password:hashedPassword,
            securityQuestion:formData.securityQuestion,
            securityAnswer:hashedSecurityAnswer,
         }
      })
      res.redirect('/login');
     }catch(err){
      console.error(err);
      return next(err);
     }
}

export default createUser;