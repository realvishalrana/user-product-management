import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

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

const createUser = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    const saltPassword = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, saltPassword);

    const isEmailAlreadyExists = await User.findOne({ email });

    if (isEmailAlreadyExists) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      email,
      userName,
      password: hashPassword,
    });

    const { password: newPassword, ...userWithoutPassword } = user.toObject();

    res.status(201).send({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("No Email is exists for this email");
      error.statusCode = 404;
      throw error;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }

    const tokenGenerate = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.send({
      data: tokenGenerate,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllUser, createUser, loginUser };
