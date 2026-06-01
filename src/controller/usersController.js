import User from "../models/userModel.js";


const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.send({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllUser };
