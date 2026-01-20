import Product from "../models/product.model.js";

const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: {
        fullDesription: req.body.fullDescription,
        shortDescription: req.body.shortDescription,
      },
      pricing: {
        price: req.body.price,
        salePrice: req.body.salePrice,
        currency: req.body.currency,
        costPrice: req.body.costPrice,
      },
      stock: {
        quantity: req.body.quantity,
      },
      media: {
        images: req.images,
        thumbnail: req.thumbnail,
      },
      category: {
        category: req.body.category,
        subCategories: [req.body.subCategories],
        tags: req.body.tags,
      },
    });
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Create Product Successful",
      data: {
        _id: product._id,
        name: product.name,
        type: product.type,
      },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const product = await Product.findById(id);

      if (!product) {
        const error = new Error({
          success: false,
          message: "Product not found",
        });
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({
        success: true,
        data: { product },
      });
    }

    const products = await Product.find();
    return res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    return next(error);
  }
};

export default { createProduct, getProduct };
