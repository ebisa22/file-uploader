import {prisma } from '../../lib/prisma.js';
const toTitleCase=(str)=>{
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
const renameFolder=async(req,res,next)=>{
  try{
     const folderId=Number(req.params.folderId);
     const folderName=toTitleCase(req.body.name);
     await prisma.folder.update({
      where:{
       id:folderId,
       userId: req.user.id,
      },
      data:{
       name:folderName
      }
     })
     res.redirect(`/folders/${folderId}`);
  }catch(err){
   console.error(err);
   next(err);
  }
}

export default renameFolder;