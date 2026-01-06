import User from "../models/user.model.js";

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const user = await User.findById(id);

      if (!user) {
        const error = new Error({ success: false, message: "User not found" });
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({
        success: true,
        data: { user },
      });
    }

    const users = await User.find();
    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (err) {
    const error = new Error(`Error: ${err}`);
    return next(error);
  }
};

export default { getCurrentUser, getUser };
