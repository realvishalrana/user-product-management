import dotenv from "dotenv";
import express from "express";
import productRoute from "./src/routes/productRoutes.js";
import usersRoute from "./src/routes/usersRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();

await connectDB();

app.use(express.json());

app.use("/api/products", productRoute);

app.use("/api/users", usersRoute);

app.use("/api/orders", orderRoute);

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Catch Mongoose invalid ID errors
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid ID format provided";
  }

  res.status(statusCode).send({
    success: false,
    message: message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
