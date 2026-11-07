import {prisma} from '../../lib/prisma.js';

const getFoldersPage=async (req,res,next)=>{
  try{
      const user=req.isAuthenticated() ?req.user : null;
      if(!user){
          return res.redirect('/login');
      }

      const folders=await prisma.folder.findMany({
        where:{
            userId:user.id,
            parentId:null
        },
        include:{
            _count:{
                select:{
                    files:true,
                    children:true
                }
            }
        }
      })
      const folderCount=folders.length;
      res.render('folders',{
        user,
        folders,
        folderCount
      })
  }catch(err){
    console.error(err);
    next(err);
  }

}

export default getFoldersPage;