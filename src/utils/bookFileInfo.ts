import path from "path";

const bookFileInfo = (files) => {
  const bookFileName = files.bookFile[0].filename;
  const bookFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "uploads",
    bookFileName,
  );
  const bookFormat = "pdf";

  return { bookFileName, bookFilePath, bookFormat };
};

export default bookFileInfo;
