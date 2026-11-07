import { prisma } from '../../lib/prisma.js';

const getFolderPath = (folder, folders) => {
  const parts = [folder.name];
  let parentId = folder.parentId;

  while (parentId !== null) {
    const parent = folders.find((item) => item.id === parentId);

    if (!parent) break;

    parts.unshift(parent.name);
    parentId = parent.parentId;
  }

  return parts.join(" / ");
};
const getMoveFolderPage=async(req,res)=>{
     const user=req.user;
     const folderId=Number(req.params.folderId);
     const folder=await prisma.folder.findUnique({
      where:{
       id:folderId
      }
     })
     const folders=await prisma.folder.findMany();
     const destinationFolders = folders
       .filter((item) => item.id !== folder.id)
       .map((item) => ({
         id: item.id,
         name: item.name,
         path: getFolderPath(item, folders),
       }));
     res.render('move-folder',{
       user,
       folder,
       destinationFolders
     })
     
}

export default getMoveFolderPage;