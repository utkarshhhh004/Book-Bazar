
import {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../services/cart.service.js";

export const getCartController = async (req, res, next) => {
  try {
    const result = await getCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Shopping cart retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const addCartItemController = async (req, res, next) => {
  try {
    const result = await addCartItem({
      buyerId: req.user.id,
      listingId: req.body.listingId,
      quantity: req.body.quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Book added to cart successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItemController = async (req, res, next) => {
  try {
    const result = await updateCartItemQuantity({
      buyerId: req.user.id,
      listingId: req.params.listingId,
      quantity: req.body.quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItemController = async (req, res, next) => {
  try {
    const result = await removeCartItem({
      buyerId: req.user.id,
      listingId: req.params.listingId,
    });

    return res.status(200).json({
      success: true,
      message: "Book removed from cart successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCartController = async (req, res, next) => {
  try {
    const result = await clearCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Shopping cart cleared successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
