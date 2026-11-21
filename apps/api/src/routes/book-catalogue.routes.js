
import { Router } from "express";

import {
  getBookCatalogueController,
} from "../controllers/book-catalogue.controller.js";

const router = Router();

router.get("/", getBookCatalogueController);

export default router;
