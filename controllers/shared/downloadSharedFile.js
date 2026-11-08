import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";

const downloadSharedFile = async (req, res, next) => {
  const { shareToken } = req.params;
  const fileId = Number(req.params.fileId);

  if (!Number.isInteger(fileId) || fileId <= 0) {
    return res.sendStatus(404);
  }

  try {
    const share = await prisma.sharedFolder.findUnique({
      where: { token: shareToken },
      include: { folder: true },
    });

    if (!share || share.revokedAt || share.expiresAt <= new Date()) {
      return res.status(404).send("This shared link is unavailable.");
    }

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: share.folder.userId,
      },
    });

    if (!file || file.folderId === null) {
      return res.sendStatus(404);
    }

    let currentFolder = await prisma.folder.findFirst({
      where: {
        id: file.folderId,
        userId: share.folder.userId,
      },
      select: {
        id: true,
        parentId: true,
      },
    });

    while (currentFolder && currentFolder.id !== share.folderId) {
      if (currentFolder.parentId === null) {
        return res.sendStatus(404);
      }

      currentFolder = await prisma.folder.findFirst({
        where: {
          id: currentFolder.parentId,
          userId: share.folder.userId,
        },
        select: {
          id: true,
          parentId: true,
        },
      });
    }

    if (!currentFolder) {
      return res.sendStatus(404);
    }

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(file.storagePath);

    if (error) {
      if (error.statusCode === "404") {
        return res.status(404).send("File not found in storage.");
      }

      throw error;
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Length", file.size.toString());
    res.attachment(file.originalName);

    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

export default downloadSharedFile;
