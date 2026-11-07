import { prisma } from "../../lib/prisma.js";

const getSharedPage = async (req, res, next) => {
  try {
    const user = req.isAuthenticated() ? req.user : null;

    if (!user) {
      return res.redirect("/login");
    }

    const sharedFolders = await prisma.sharedFolder.findMany({
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
    });

    const now = new Date();

    const formattedSharedFolders = sharedFolders.map((shared) => {
      let status;

      if (shared.revokedAt) {
        status = "revoked";
      } else if (shared.expiresAt <= now) {
        status = "expired";
      } else {
        status = "active";
      }

      return {
        ...shared,
        status,
        formattedDate: shared.createdAt.toLocaleDateString(),
        formattedExpiry: shared.expiresAt.toLocaleDateString(),
        shareUrl: `${req.protocol}://${req.get("host")}/share/${shared.token}`,
      };
    });

    const sharedFolderCount = sharedFolders.length;

    res.render("shared", {
      user,
      sharedFolders: formattedSharedFolders,
      sharedFolderCount,
    });
  } catch (err) {
    next(err);
  }
};

export default getSharedPage;