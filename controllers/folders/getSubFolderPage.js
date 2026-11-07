import { prisma } from "../../lib/prisma.js";

const getSubFolderPage = async (req, res, next) => {
  const folderId = Number(req.params.folderId);
  const user = req.user;

  try {
    if (!Number.isInteger(folderId) || folderId <= 0) {
      return res.sendStatus(404);
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: user.id,
      },
      include: {
        children: {
          orderBy: {
            name: "asc",
          },
          include: {
            _count: {
              select: {
                files: true,
                children: true,
              },
            },
          },
        },
        files: {
          orderBy: {
            originalName: "asc",
          },
        },
      },
    });

    if (!folder) {
      return res.sendStatus(404);
    }

    const folders = folder.children;
    const files = folder.files;
    const folderCount = folders.length;
    const fileCount = files.length;

    res.render("folders", {
      user,
      folder,
      folders,
      files,
      folderCount,
      fileCount,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default getSubFolderPage;