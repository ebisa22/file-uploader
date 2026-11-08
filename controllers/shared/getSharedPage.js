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

const getSharedPage = async (req, res, next) => {
  const user = req.user;
  if(!user){
    res.redirect('/login');
  }
  try {
    const [folders, sharedFolders] = await Promise.all([
      prisma.folder.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          name: true,
          parentId: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.sharedFolder.findMany({
        where: {
          folder: {
            userId: user.id,
          },
        },
        include: {
          folder: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const formattedFolders = folders.map((folder) => ({
      ...folder,
      path: getFolderPath(folder, folders),
    }));

    const formattedSharedFolders = sharedFolders.map((share) => ({
      ...share,
      formattedDate: share.createdAt.toLocaleDateString(),
      formattedExpiry: share.expiresAt.toLocaleString(),
    }));

    res.render("shared", {
      user,
      folders: formattedFolders,
      sharedFolders: formattedSharedFolders,
      shareError: null,
      formErrors: {},
      formValues: {},
    });
  } catch (err) {
    next(err);
  }
};

export default getSharedPage;
