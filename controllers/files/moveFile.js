import { prisma } from "../../lib/prisma.js";

const moveFile = async (req, res, next) => {
  const fileId = Number(req.params.fileId);
  const destinationId =
    req.body.destinationId === "" ? null : Number(req.body.destinationId);

  const user = req.user;

  try {
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.sendStatus(404);
    }

    if (
      destinationId !== null &&
      (!Number.isInteger(destinationId) || destinationId <= 0)
    ) {
      return res.sendStatus(400);
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
    }

    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        folderId: destinationId,
      },
    });

    res.redirect(destinationId ? `/folders/${destinationId}` : "/folders");
  } catch (err) {
    next(err);
  }
};

export default moveFile;