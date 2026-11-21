import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookCatalogueRoutes from "./routes/book-catalogue.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import listingRoutes from "./routes/listing.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

// Request parsing middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Book Bazar API",
  });
});

// API Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookCatalogueRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

// Seller and Listing Routes
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1/listings", listingRoutes);

// Error Handling - Always keep these LAST
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
