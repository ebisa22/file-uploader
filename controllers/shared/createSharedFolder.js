import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";

const createSharedFolder = async (req, res, next) => {
  const user = req.user;
  const folderId = Number(req.body.folderId);
  const expiresAt = new Date(req.body.expiresAt);

  try {
    if (!Number.isInteger(folderId) || folderId <= 0) {
      return res.status(400).render("shared", {
        user,
        folders: [],
        sharedFolders: [],
        shareError: "Please select a valid folder.",
        formErrors: {},
        formValues: req.body,
      });
    }

    if (
      !req.body.expiresAt ||
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt <= new Date()
    ) {
      return res.status(400).render("shared", {
        user,
        folders: [],
        sharedFolders: [],
        shareError: "Please choose a future expiration date.",
        formErrors: {},
        formValues: req.body,
      });
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

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.sharedFolder.create({
      data: {
        token,
        folderId,
        expiresAt,
      },
    });

    res.redirect("/shared");
  } catch (err) {
    next(err);
  }
};

export default createSharedFolder;
