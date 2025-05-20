const ProductModel = require('../Models/Product');

//create product functionality
const createProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  let image = '';

  if (req.file) {
    image = req.file.path; // or req.file.filename or URL depending on your setup
  }

  try {
    const product = await ProductModel.findOne({ name });
    if (product) {
      return res.status(409).json({
        message: 'Product already exists, please use a different name',
        success: false
      });
    }
    
    // Create productModel after you have image variable set
    const productModel = new ProductModel({ name, quantity, price, image });
    await productModel.save();

    res.status(201).json({
      message: 'Product created successfully',
      success: true
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


//get all products functionality
const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.status(200)
            .json({
                message: 'All products fetched successfully',
                success: true,
                products
            });
        if (products.length === 0) {
            return res.status(404)
                .json({
                    message: 'No products found',
                    success: false
                });
        }

    } catch (error) {
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });        
    }
}


//get single product functionality
const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404)
                .json({
                    message: 'Product not found',
                    success: false
                });
        }
        res.status(200)
            .json({ 
                message: 'Product fetched successfully',
                success: true,
                product
            });
    } catch (error) {
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });
    }
}

//update product functionality
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
     let image = '';

    if(req.file){
        image = req.file.path; // Or req.file.filename depending on your usage
    }
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404)
                .json({
                    message: 'Product not found',
                    success: false
                });
        }
        product.name = name;
        product.quantity = quantity;
        product.price = price;
        if (image) {
            product.image = image;
        }
        
        await product.save();
        res.status(200)
            .json({
                message: 'Product updated successfully',
                success: true
            });
    } catch (error) {
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });
    }
}
//delete product functionality
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404)
                .json({
                    message: 'Product not found',
                    success: false
                });
        }
        await product.deleteOne();
        res.status(200)
            .json({
                message: 'Product deleted successfully',
                success: true
            });
    } catch (error) {
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });
    }
}





module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};