const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o750 }); 
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
    return cb(new Error('type de fuchier invalide'), false);
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return cb(new Error('type de fuchier invalide'), false);
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const randomName = Math.floor(Math.random(1545654) + Math.random(1111111112255)).toString();
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  console.log("test");
  if (!req.file) 
    return res.status(400).json({ error: 'Fichier pas valid uploadé' });

  res.json({
    success: true,
    filename: req.file.filename
  });

});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) 
    return res.status(400).json({ error: err.message });

  if (err)
    return res.status(400).json({ error: err.message });

  next();
});

module.exports = router;