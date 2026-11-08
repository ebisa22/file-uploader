import { prisma } from "../../lib/prisma.js";

const getFoldersPage = async (req, res, next) => {
  try {
    const user = req.user;

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
        parentId: null,
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const folderCount = folders.length;
    const files = await prisma.file.findMany({
      where: {
        userId: user.id,
        folderId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.render("folders", {
      user,
      folders,
      folderCount,
      files
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default getFoldersPage;