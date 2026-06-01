import express from "express";
import {
  getAllUser,
  createUser,
  loginUser,
} from "./../controller/usersController.js";
import { verifyAuthToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyAuthToken, getAllUser);

router.post("/", createUser);

router.post("/login", loginUser);

export default router;
