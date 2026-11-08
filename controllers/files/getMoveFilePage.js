import { prisma } from "../../lib/prisma.js";

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

const getMoveFilePage = async (req, res, next) => {
  const user = req.user;
  const fileId = Number(req.params.fileId);

  try {
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.sendStatus(404);
    }

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    if (!file) {
      return res.sendStatus(404);
    }

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    const destinationFolders = folders
      .filter((item) => item.id !== file.folderId)
      .map((item) => ({
        id: item.id,
        name: item.name,
        path: getFolderPath(item, folders),
      }));

    res.render("move-file", {
      user,
      file,
      destinationFolders,
    });
  } catch (err) {
    next(err);
  }
};

export default getMoveFilePage;