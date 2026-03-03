const express = require('express');
const multer = require('multer');
const path = require('path');
const { hashPassword } = require('../utils/secure_pass')
const fs = require('fs');
const auth = require('../middleware/auth');
const { fileTypeFromFile } = require('file-type');
const dotenv = require('dotenv');
const sharp = require('sharp');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o750 }); 
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
  console.log(req.body);
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
    return cb(new Error('type de fichier invalide'), false);
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return cb(new Error('type de fu*ichier invalide'), false);
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: async (req, file, cb) => {
    const max = 9999999999999;
    const min = 100000000;
    const randomName = btoa(await hashPassword(Math.round(Math.random() * (max - min) + min).toString() + process.env.SEED_UPLOAD));
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

router.post('/img', auth, upload.single('file'), async (req, res) => {
  try {
    await sharp(req.file.path)
    .resize({ width: 1024 })
    .withMetadata(false)
    .toFile(req.file.path + "_tmp");
    
    fs.renameSync(req.file.path + "_tmp", req.file.path);

    const type = await fileTypeFromFile(req.file.path);
    if (!type)
    {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Fichier pas valid !' });
    }
    if (!req.file)
      return res.status(400).json({ error: 'Fichier pas valid uploadé' });
  
    res.json({
      success: true,
      filename: req.file.filename
    });
  }
  catch (err)
  {
    console.log(err);
    return res.status({erreur: "Une erreur s'est produite lors de l'upload "});
  }

});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) 
    return res.status(400).json({ error: err.message });

  if (err)
    return res.status(400).json({ error: err.message });

  next();
});

module.exports = router;