import {prisma} from '../../lib/prisma.js';

const renderAccountPage = async (req, res, overrides = {}) => {
  const user = req.user;
  const [fileCount, folderCount, storageResult] = await Promise.all([
    prisma.file.count({
      where: { userId: user.id },
    }),
    prisma.folder.count({
      where: { userId: user.id },
    }),
    prisma.file.aggregate({
      where: { userId: user.id },
      _sum: { size: true },
    }),
  ]);

  const usedBytes = Number(storageResult._sum.size ?? 0n);
  const storageLimitBytes = 5 * 1024 ** 3;

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

  const securityQuestions = [
    "What was the name of your first school?",
    "What was the name of your childhood best friend?",
    "What city were you born in?",
    "What was your childhood nickname?",
    "What was the name of your first pet?",
    "What was your favorite childhood food?",
    "What was the first concert you attended?",
    "What was the name of your favorite childhood teacher?",
  ];

  res.render("account", {
    user,
    storageUsed: formatSize(usedBytes),
    storageLimit: "5 GB",
    storagePercentage: Math.min(
      (usedBytes / storageLimitBytes) * 100,
      100,
    ).toFixed(1),
    fileCount,
    folderCount,
    securityQuestions,
    profileErrors: {},
    profileValues: {},
    passwordErrors: {},
    securityErrors: {},
    securityValues: {},
    deleteErrors: {},
    ...overrides,
  });
};

export { renderAccountPage };
