import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";

const deleteFolder = async (req, res, next) => {
  const folderId = Number(req.params.folderId);

  if (!Number.isInteger(folderId) || folderId <= 0) {
    return res.sendStatus(404);
  }

  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        parentId: true,
      },
    });

    const folder = folders.find((folder) => folder.id === folderId);

    if (!folder) {
      return res.sendStatus(404);
    }

    const folderIds = new Set([folderId]);

    let currentIds = [folderId];

    while (currentIds.length > 0) {
      const children = folders.filter((folder) =>
        currentIds.includes(folder.parentId),
      );

      currentIds = children.map((folder) => folder.id);

      currentIds.forEach((id) => folderIds.add(id));
    }

    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        folderId: {
          in: [...folderIds],
        },
      },
      select: {
        storagePath: true,
      },
    });

    const storagePaths = files.map((file) => file.storagePath);

    for (let i = 0; i < storagePaths.length; i += 100) {
      const batch = storagePaths.slice(i, i + 100);

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(batch);

      if (error) {
        throw error;
      }
    }

    await prisma.folder.delete({
      where: {
        id: folderId,
        userId: req.user.id,
      },
    });

    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

export default deleteFolder;