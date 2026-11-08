import { prisma } from "../../lib/prisma.js";
import { supabase } from "../../lib/supabase.js";

const downloadFile = async (req, res, next) => {
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

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(file.storagePath);

    if (error) {
      if (error.statusCode === "404") {
        return res.status(404).send("File not found in storage.");
      }

      throw error;
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Length", file.size.toString());
    res.attachment(file.originalName);

    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

export default downloadFile;
