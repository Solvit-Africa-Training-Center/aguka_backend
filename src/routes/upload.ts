import { Router } from 'express';
import { upload } from '../utils/upload';

const uploadRouter = Router();

uploadRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('failed to upload');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('file uploaded');
  res.json({
    message: 'File uploaded successfully!',
    url: (req.file as any).path,
  });
});

export default uploadRouter;
