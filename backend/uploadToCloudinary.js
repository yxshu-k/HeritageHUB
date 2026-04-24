const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

cloudinary.config({
  cloud_name: 'dnxjp6sqp',
  api_key: '296863294447337',
  api_secret: 'bdaLKJej6Gd0d8-yyt3DYdHeLkQ',
});

const imagesToUpload = [
  'C:\\Users\\theek\\.gemini\\antigravity\\brain\\38c3164a-52cb-4589-b7ff-dba107b3f3f3\\mughal_coin_premium_1777027508662.png',
  'C:\\Users\\theek\\.gemini\\antigravity\\brain\\38c3164a-52cb-4589-b7ff-dba107b3f3f3\\victorian_watch_premium_1777027547959.png',
  'C:\\Users\\theek\\.gemini\\antigravity\\brain\\38c3164a-52cb-4589-b7ff-dba107b3f3f3\\greek_amphora_premium_1777027575043.png'
];

async function uploadImages() {
  console.log('Starting Cloudinary uploads...');
  for (const imgPath of imagesToUpload) {
    try {
      const result = await cloudinary.uploader.upload(imgPath, {
        folder: 'heritagehub_demo',
      });
      console.log(`Uploaded: ${imgPath} => ${result.secure_url}`);
    } catch (err) {
      console.error(`Failed to upload ${imgPath}:`, err.message);
    }
  }
}

uploadImages();
