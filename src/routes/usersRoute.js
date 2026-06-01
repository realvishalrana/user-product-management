import express from "express";
import { getAllUser } from "./../controller/usersController.js";

const router = express.Router();

router.get("/", getAllUser);

export default router;
