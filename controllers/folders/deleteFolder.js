import { prisma } from "../../lib/prisma.js";
 
const deleteFolder = async (req, res, next) => {
  try {
    const folderId = Number(req.params.folderId);
    await prisma.folder.delete({
      where: {
        id: folderId,
      }
    });

    res.redirect('/folders');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default deleteFolder;
