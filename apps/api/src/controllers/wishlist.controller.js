
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../services/wishlist.service.js";

export const getWishlistController = async (req, res, next) => {
  try {
    const result = await getWishlist(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const addWishlistItemController = async (req, res, next) => {
  try {
    const result = await addWishlistItem({
      userId: req.user.id,
      bookId: req.body.bookId,
    });

    return res.status(200).json({
      success: true,
      message: "Book saved to wishlist successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeWishlistItemController = async (req, res, next) => {
  try {
    const result = await removeWishlistItem({
      userId: req.user.id,
      bookId: req.params.bookId,
    });

    return res.status(200).json({
      success: true,
      message: "Book removed from wishlist successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
