import {renderAccountPage} from './renderAccountPage.js'
import {prisma} from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
const checkCorrectPassword = async (password,user) => {
  const {password:userPassword} = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  if (!userPassword) {
    return false;
  }
  const correctPassword = await bcrypt.compare(password, userPassword);

  if (!correctPassword) {
    return false;
  }
  return true;
};

const handleDeleteAccount=async (req,res,next)=>{
   try{
     const correctPassword=await checkCorrectPassword(req.body.password,req.user);
     if(!correctPassword){
       return renderAccountPage(req, res, {
         deleteErrors: {
          msg:"Incorrect password"
         },
       });
     }
     
     await prisma.user.delete({
         where: {
           id: req.user.id,
         },
       });
       
      req.logout((err) => {
         if (err) {
           return next(err);
         }

         res.redirect("/");
       });
   }catch(err){
    console.error(err);
    next(err);
   }
}

export default handleDeleteAccount;