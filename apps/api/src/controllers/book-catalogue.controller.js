
import { getBookCatalogue } from "../services/book-catalogue.service.js";

export const getBookCatalogueController = async (req, res, next) => {
  try {
    const result = await getBookCatalogue(req.query);

    return res.status(200).json({
      success: true,
      message: "Book catalogue retrieved successfully.",
      data: result.books,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
