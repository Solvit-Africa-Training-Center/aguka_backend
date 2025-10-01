import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from 'dotenv';
config();

const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;
const cloudinary_api_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: cloudinary_api_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      format: file.mimetype.split('/')[1],
      public_id: Date.now().toString(),
    };
  },
});

export const upload = multer({ storage });
