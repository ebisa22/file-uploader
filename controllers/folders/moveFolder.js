import { prisma } from "../../lib/prisma.js";

const moveFolder = async (req, res, next) => {
  const folderId = Number(req.params.folderId);
  const destinationId =
    req.body.destinationId === "" ? null : Number(req.body.destinationId);

  const user = req.user;

  try {
    if (!Number.isInteger(folderId) || folderId <= 0) {
      return res.sendStatus(404);
    }

    if (
      destinationId !== null &&
      (!Number.isInteger(destinationId) || destinationId <= 0)
    ) {
      return res.sendStatus(400);
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: user.id,
      },
    });

    if (!folder) {
      return res.sendStatus(404);
    }

    if (destinationId !== null) {
      const destination = await prisma.folder.findFirst({
        where: {
          id: destinationId,
          userId: user.id,
        },
      });

      if (!destination) {
        return res.sendStatus(404);
      }

      const folders = await prisma.folder.findMany({
        where: { userId: user.id },
        select: { id: true, parentId: true },
      });

      const descendants = new Set([folderId]);

      let foundNewDescendant = true;

      while (foundNewDescendant) {
        foundNewDescendant = false;

        for (const item of folders) {
          if (descendants.has(item.parentId) && !descendants.has(item.id)) {
            descendants.add(item.id);
            foundNewDescendant = true;
          }
        }
      }

      if (descendants.has(destinationId)) {
        return res
          .status(400)
          .send("Cannot move a folder into itself or its descendants.");
      }
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { parentId: destinationId },
    });

    res.redirect(destinationId ? `/folders/${destinationId}` : "/folders");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default moveFolder;