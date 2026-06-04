import Order from "../models/orderModal.js";
import Product from "../models/productModel.js";

const getOrder = async (req, res, next) => {
  try {
    const orderData = await Order.find().populate("user");

    res.send({
      data: orderData,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { orderItems } = req.body;
    const userId = req.user;

    if (!orderItems || orderItems.length === 0) {
      const error = new Error("No Order Items Provided");
      error.statusCode = 400;
      throw error;
    }

    let calculatedTotal = 0;
    const finalOrderItems = [];

    for (const item of orderItems) {
      const realProduct = await Product.findById(item.product);

      if (!realProduct) {
        const error = new Error(`Product with ID ${item.product} not found`);
        error.statusCode = 404;
        throw error;
      }

      const itemCost = realProduct.price * item.quantity;
      calculatedTotal += itemCost;

      finalOrderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: realProduct.price,
      });
    }

    const newOrder = await Order.create({
      user: userId,
      orderItems: finalOrderItems,
      totalAmount: calculatedTotal,
    });
    await newOrder.populate("user");

    res.status(201).send({
      success: true,
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
};

const getTotalRevenue = async (req, res, next) => {
  try {
    const getTotalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    res.send({
      data: getTotalRevenueData,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getOrder, createOrder };
