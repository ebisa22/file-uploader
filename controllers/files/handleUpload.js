import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";
import { randomUUID } from "node:crypto";

const handleUpload = async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("Please select a file to upload.");
  }

  const folderId = req.body.folderId ? Number(req.body.folderId) : null;

  if (folderId !== null && (!Number.isInteger(folderId) || folderId <= 0)) {
    return res.status(400).send("Invalid folder.");
  }

  try {
    if (folderId !== null) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          userId: req.user.id,
        },
      });

      if (!folder) {
        return res.status(404).send("Folder not found.");
      }
    }

    const storedName = randomUUID();
    const storagePath = `user-${req.user.id}/${storedName}`;

    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    try {
      await prisma.file.create({
        data: {
          originalName: file.originalname,
          storedName,
          mimeType: file.mimetype,
          size: BigInt(file.size),
          storagePath,
          userId: req.user.id,
          folderId,
        },
      });
    } catch (err) {
      await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove([storagePath]);

      throw err;
    }

    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
};

export default handleUpload;
