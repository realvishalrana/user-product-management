import Product from "../models/productModel.js";

const getProduct = async (req, res, next) => {
  try {
    let queryObj = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    let sort = {};

    let category = req.query?.category;
    if (category) {
      queryObj.category = category;
    }

    if (req.query?.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query?.minPrice) {
        queryObj.price.$gte = Number(req.query.minPrice);
      }
      if (req.query?.maxPrice) {
        queryObj.price.$lte = Number(req.query.maxPrice);
      }
    }

    if (req.query?.search) {
      queryObj.$or = [
        { category: { $regex: req.query.search, $options: "i" } },
        { name: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.sort) {
      sort[req.query.sort] = 1;
    }

    const startIndex = (page - 1) * limit;

    const products = await Product.find(queryObj).sort(sort).skip(startIndex).limit(limit);

    const total = await Product.countDocuments(queryObj);

    res.send({
      success: true,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock) {
      const error = new Error("All fields are required");
      error.statusCode = 400; // Assign a specific status code!
      throw error; // Throw it, and the catch block sends it to the global handler
    }

    const product = await Product.create({
      name,
      price,
      category,
      stock,
    });

    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findProdcut = await Product.findById(id);

    if (!findProdcut) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export {
  getProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
