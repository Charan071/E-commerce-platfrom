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
