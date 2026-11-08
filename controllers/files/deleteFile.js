import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";

const deleteFile = async (req, res, next) => {
  const fileId = Number(req.params.fileId);

  if (!Number.isInteger(fileId) || fileId <= 0) {
    return res.sendStatus(404);
  }

  try {
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: req.user.id,
      },
    });

    if (!file) {
      return res.sendStatus(404);
    }

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([file.storagePath]);

    if (error) {
      throw error;
    }

    await prisma.file.delete({
      where: {
        id: file.id,
      },
    });

    if (file.folderId !== null) {
      return res.redirect(`/folders/${file.folderId}`);
    }

    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

export default deleteFile;