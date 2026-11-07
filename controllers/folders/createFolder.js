import {prisma} from '../../lib/prisma.js';
const toTitleCase=(str)=>{
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
const createFolder=async (req,res,next)=>{
      const user=req.user;
      const folderName=toTitleCase(req.body.name);
      const parentId=req.body.parentId ? Number(req.body.parentId) :null;
      try{
        if(parentId){
        await prisma.folder.create({
           data: {
             name: folderName,
             userId: user.id,
             parentId:parentId
           },
         });
        }else{
          await prisma.folder.create({
            data: {
              name: folderName,
              userId: user.id,
            },
          });
        }
      res.redirect(req.originalUrl);
      }catch(err){
       console.error(err);
       next(err);
      }
}

export default createFolder;