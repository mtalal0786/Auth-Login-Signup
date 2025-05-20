const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = require('express').Router();

// Define a writable directory, e.g. /tmp/uploads
const uploadDir = path.join('/tmp', 'uploads');

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage with diskStorage to control destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use a timestamp + original filename or customize as needed
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const ensureAuthenticated = require('../Middlewares/Auth');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require('../Controllers/ProductController');

router.post('/create', ensureAuthenticated, upload.single('image'), createProduct);
router.get('/getall', ensureAuthenticated, getAllProducts);
router.get('/get/:id', ensureAuthenticated, getSingleProduct);
router.put('/update/:id', ensureAuthenticated, upload.single('image'), updateProduct);
router.delete('/delete/:id', ensureAuthenticated, deleteProduct);

module.exports = router;
