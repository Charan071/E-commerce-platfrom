import { v2 as cloudinary } from "cloudinary";

export { cloudinary };

export interface UploadResult {
  url: string;
  publicId: string;
}

let didConfigureCloudinary = false;

function getCloudinary() {
  if (!didConfigureCloudinary) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    didConfigureCloudinary = true;
  }

  return cloudinary;
}

export async function uploadImage(
  file: string,
  folder = "anavasilks/products"
): Promise<UploadResult> {
  const result = await getCloudinary().uploader.upload(file, {
    folder,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await getCloudinary().uploader.destroy(publicId);
}

export async function listFolderImages(folder: string): Promise<UploadResult[]> {
  const cld = getCloudinary();
  const result = await cld.api.resources({
    type: "upload",
    prefix: folder,
    max_results: 50,
    resource_type: "image",
  });
  return (result.resources as { secure_url: string; public_id: string }[]).map((r) => ({
    url: r.secure_url,
    publicId: r.public_id,
  }));
}
