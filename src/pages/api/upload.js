// pages/api/upload.js

import multer from 'multer';
import { join } from 'path';

// Configure multer storage
const storage = multer.diskStorage({
  destination: join(process.cwd(), 'public', 'images'),
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop();
    callback(null, `${uniqueSuffix}.${extension}`);
  },
});

// Create multer instance
const upload = multer({ storage });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Use the multer middleware to handle file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }

      const { file } = req;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { filename, path } = file;

      // Do any necessary processing or validation with the uploaded file

      return res.status(200).json({ filename, path });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
