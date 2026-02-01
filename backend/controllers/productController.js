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

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const product = await Product.findById(id);

      if (!product) {
        const error = new Error('Error: Product not found');
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({
        success: true,
        data: { product },
      });
    }
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { limit, maxPrice, minPrice } = req.query;

    const filters = {};
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await Product.find({
      "pricing.price": filters.price,
    }).limit(Number(limit));

    const total = await Product.countDocuments(filters);

    return res.status(200).json({
      success: true,
      data: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
        results: products,
      },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!req.params.id) {
      const error = new Error("ProductId missing in request");
      return next(error);
    }
    const {
      name,
      fullDescription,
      shortDescription,
      price,
      salePrice,
      quantity,
    } = req.body;

    await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name,
        "description.fullDescription": fullDescription,
        "description.shortDescription": shortDescription,
        "pricing.price": price,
        "pricing.salePrice": salePrice,
        "stock.quantity": quantity,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Product successfully updated",
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!req.params.id) {
      const error = new Error("ProductId missing in request");
      return next(error);
    }
    await Product.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      message: "Product successfully deleted",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createProduct,
  getProductById,
  getProduct,
  updateProduct,
  deleteProduct,
};
