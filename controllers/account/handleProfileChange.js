import { renderAccountPage } from "./renderAccountPage.js";
import {prisma} from '../../lib/prisma.js';

const handleProfileChange=async (req,res,next)=>{
       if(req.validationErrors){
          return renderAccountPage(req, res, {
            profileErrors: req.validationErrors,
            profileValues: {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
            },
          });
       }
       try{
          const user=await prisma.user.update({
            where:{
                id:req.user.id
            },
            data:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email
            }
          })
        res.redirect('/account');
       }catch(err){
        console.error(err);
        next(err);
       }
}

export default handleProfileChange;