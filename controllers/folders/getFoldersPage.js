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

    res.render("folders", {
      user,
      folders,
      folderCount,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default getFoldersPage;