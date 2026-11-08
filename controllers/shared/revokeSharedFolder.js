import {prisma} from '../../lib/prisma.js';

const revokeSharedFolder=async(req,res,next)=>{
 const shareId = Number(req.params.shareId);
 try{
     await prisma.sharedFolder.update({
       where: {
         id: shareId,
       },
       data: {
         revokedAt: new Date(),
       },
     });

     res.redirect('/shared');
 }catch(err){
   console.error(err);
   next(err);
 }
}

export default revokeSharedFolder;