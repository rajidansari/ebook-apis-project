import path from "path";

const coverImageInfo = (files) => {
  const coverImageMimeTye = files.coverImage[0].mimetype.split("/")[1];
  const coverImageFileName = files.coverImage[0].filename;
  const coverImageFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "uploads",
    coverImageFileName,
  );

  return { coverImageFileName, coverImageFilePath, coverImageMimeTye };
};

export default coverImageInfo;
