import cloudinary from "../config/cloudinary.ts";

type ResourceType = "image" | "video" | "raw" | "auto";

const cloudinaryFileUploader = async (
  filePath: string,
  resourceType: ResourceType,
  fileName: string,
  folderName: string,
  format: string,
) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    filename_override: fileName,
    folder: folderName,
    format: format,
  });
};

export default cloudinaryFileUploader;
