const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|txt|zip|mp4|webm/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('File format not supported. Only documents, images, zip, and videos allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
  fileFilter: fileFilter,
});

module.exports = upload;
