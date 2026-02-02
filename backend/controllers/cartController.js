import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const addToCart = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    if (!productId) {
      const error = new Error("Missing productId");
      return next(error);
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product doesn't exist");
      error.status = 404;
      return next(error);
    }

    const cartItem = {
      product: productId,
      name: product.name,
      thumbnail: product.media.thumbnail,
      price: product.pricing.price,
      quantity: req.body.quantity,
    };

    // Check if user has an active cart
    const userCart = await Cart.findOne({ user: req.user._id });
    if (userCart) {
      try {
        await userCart.updateOne({ items: [...userCart.items, cartItem] });
        return res.status(200).json({
          success: true,
          message: "Product successfully added to cart",
        });
      } catch (err) {
        next(err);
      }
    } else {
      const cart = new Cart({
        user: req.user._id,
        items: [cartItem],
        subTotal: cartItem.price,
      });

      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Product successfully added to cart",
      });
    }
  } catch (err) {
    next(err);
  }
};

export default { addToCart };

// const userExists = await User.exists({ _id: userId });
// if (!userExists) throw new Error("Invalid user");
