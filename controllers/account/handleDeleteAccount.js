import {renderAccountPage} from './renderAccountPage.js'
import {prisma} from '../../lib/prisma.js';
import {supabase} from '../../lib/supabase.js';
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
  const user=req.user;
   try{
     const correctPassword=await checkCorrectPassword(req.body.password,user);
     if(!correctPassword){
       return renderAccountPage(req, res, {
         deleteErrors: {
          msg:"Incorrect password"
         },
       });
     }
     const files=await prisma.file.findMany({
      where:{
        userId:user.id
      }
     });


      const { error: deleteError } = await supabase.storage.from(
        process.env.SUPABASE_BUCKET,
      ).remove(files.map(file=>file.storagePath));

      if(deleteError){
        throw deleteError;
      }
    
     await prisma.user.delete({
         where: {
           id: user.id,
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