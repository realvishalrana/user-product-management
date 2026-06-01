import express from "express";
import {
  getProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} from "./../controller/productController.js";

const router = express.Router();

router.get("/", getProduct);

router.get("/:id", getProductById);

router.post("/create", createProduct);

router.patch("/:id", updateProduct);

router.delete("/:id",deleteProduct)

export default router;
