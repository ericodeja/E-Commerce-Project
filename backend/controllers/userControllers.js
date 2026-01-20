import User from "../models/user.model.js";

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

const updateUser = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;

    const result = await User.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).json({
      success: true,
      data: { result },
    });
  } catch (err) {
    const error = new Error(`Update Error: ${err}`);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    const error = new Error(`Delete Error: ${err}`);
    next(error);
  }

  //Learn joins and parent-child relationship , Foreign Keys
};

export default { getUser, updateUser, deleteUser };
