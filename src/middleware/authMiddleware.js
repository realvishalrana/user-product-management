import jwt from "jsonwebtoken";

const verifyAuthToken = (req, res, next) => {
  try {
    // 1. Safely grab the header (Express is case-insensitive with headers)
    const authHeader = req.headers.authorization;

    // 2. Check if the header exists AND starts with "Bearer " BEFORE splitting
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Access denied. No token provided.");
      error.statusCode = 401; // Match your global error handler!
      throw error;
    }

    // 3. Now it is 100% safe to split
    const token = authHeader.split(" ")[1];

    // 4. Verify the token
    // (If it's bad or expired, this line throws an error and jumps to catch)
    const decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

    // 5. Attach the user ID to the request object
    // (Make sure you used "id" when you originally created the token!)
    req.user = decodedPayload.userId;

    // 6. Move to the next function (the controller)
    next();
  } catch (error) {
    next(error);
  }
};

export { verifyAuthToken };
