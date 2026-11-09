import  {prisma} from '../../lib/prisma.js';

const renameFile=async(req,res,next)=>{
 const fileId=Number(req.params.fileId);
 const fileName=req.body.name;
 try{
  const file=await prisma.file.update({
   where:{
    id:fileId,
    userId: req.user.id,
   },
   data:{
    originalName:fileName
   }
  })
  const folderId=file.folderId;
  if(folderId){
   res.redirect(`/folders/${folderId}`);
  }else{
   res.redirect('/folders');
  }
 }catch(err){
   console.error(err);
   next(err);
 }
}

export default renameFile;