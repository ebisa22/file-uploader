import { prisma } from "../lib/prisma.js";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(1)} ${units[index]}`;
};

const handleSharedAccess = async (req, res, next) => {
  const { shareToken } = req.params;
  const folderId = req.params.folderId ? Number(req.params.folderId) : null;

  try {
    const share = await prisma.sharedFolder.findUnique({
      where: {
        token: shareToken,
      },
      include: {
        folder: true,
      },
    });

    if (!share || share.revokedAt || share.expiresAt <= new Date()) {
      return res.status(404).send("This shared link is unavailable.");
    }

    const currentFolderId = folderId ?? share.folderId;

    if (!Number.isInteger(currentFolderId) || currentFolderId <= 0) {
      return res.sendStatus(404);
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: currentFolderId,
        userId: share.folder.userId,
      },
    });

    if (!folder) return res.sendStatus(404);

    const breadcrumbs = [];
    let current = folder;

    while (current.id !== share.folderId) {
      breadcrumbs.unshift({
        id: current.id,
        name: current.name,
      });

      if (current.parentId === null) {
        return res.sendStatus(404);
      }

      current = await prisma.folder.findFirst({
        where: {
          id: current.parentId,
          userId: share.folder.userId,
        },
      });

      if (!current) return res.sendStatus(404);
    }

    const [folders, files] = await Promise.all([
      prisma.folder.findMany({
        where: {
          parentId: folder.id,
          userId: share.folder.userId,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.file.findMany({
        where: {
          folderId: folder.id,
          userId: share.folder.userId,
        },
        orderBy: {
          originalName: "asc",
        },
      }),
    ]);

    const formattedFiles = files.map((file) => ({
      ...file,
      formattedSize: formatSize(Number(file.size)),
    }));

    res.render("shared-folder", {
      share,
      folder,
      folders,
      files: formattedFiles,
      breadcrumbs,
    });
  } catch (err) {
    next(err);
  }
};

export default handleSharedAccess;
