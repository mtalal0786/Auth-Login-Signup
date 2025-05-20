const multer = require('multer');
const router = require('express').Router();
const upload = multer({ dest: 'uploads/' });
const ensureAuthenticated = require('../Middlewares/Auth');
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../Controllers/ProductController');

router.post('/create', ensureAuthenticated, upload.single('image'), createProduct);
router.get('/getall', ensureAuthenticated, getAllProducts);
router.get('/get/:id', ensureAuthenticated, getSingleProduct);
router.put('/update/:id', ensureAuthenticated, upload.single('image'), updateProduct);
router.delete('/delete/:id', ensureAuthenticated, deleteProduct);


module.exports = router;


