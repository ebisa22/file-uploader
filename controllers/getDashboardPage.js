import { prisma } from "../lib/prisma.js";

const getDashboardPage = async (req, res, next) => {
  const user = req.isAuthenticated() ? req.user : null;

  if (!user) {
    return res.redirect("/login");
  }

  try {
    const rootFolders = await prisma.folder.findMany({
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

    const folderCount = await prisma.folder.count({
      where: {
        userId: user.id,
      },
    });

    const fileCount = await prisma.file.count({
      where: {
        userId: user.id,
      },
    });

    const storageResult = await prisma.file.aggregate({
      where: {
        userId: user.id,
      },
      _sum: {
        size: true,
      },
    });

    const usedBytes = Number(storageResult._sum.size ?? 0n);

    const sharedFolderCount = await prisma.sharedFolder.count({
      where: {
        folder: {
          userId: user.id,
        },
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    const rootFiles = await prisma.file.findMany({
      where: {
        userId: user.id,
        folderId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const storageLimitBytes = 5 * 1024 ** 3;

    const storagePercentage = Math.min(
      (usedBytes / storageLimitBytes) * 100,
      100,
    );

    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;

      const units = ["KB", "MB", "GB", "TB"];
      let size = bytes / 1024;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const formattedRootFiles = rootFiles.map((file) => ({
      ...file,
      formattedSize: formatSize(Number(file.size)),
      formattedDate: file.createdAt.toLocaleDateString(),
    }));

    res.render("dashboard", {
      user,
      rootFolders,
      folderCount,
      fileCount,
      sharedFolderCount,
      storageUsed: formatSize(usedBytes),
      storageLimit: "5 GB",
      storagePercentage: storagePercentage.toFixed(1),
      rootFiles: formattedRootFiles,
    });
  } catch (err) {
    next(err);
  }
};

export default getDashboardPage;