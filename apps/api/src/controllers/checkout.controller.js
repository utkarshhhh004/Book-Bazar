import {
  previewCheckout,
  createCheckout,
} from "../services/checkout.service.js";

export const checkoutPreviewController = async (req, res, next) => {
  try {
    const result = await previewCheckout({
      buyerId: req.user.id,
      addressId: req.body.addressId,
    });

    return res.status(200).json({
      success: true,
      message: "Checkout preview generated successfully.",
      data: {
        items: result.items,
        bookSubtotalPaise: result.bookSubtotalPaise,
        shippingTotalPaise: 0,
        gatewayFeePaise: 0,
        taxTotalPaise: 0,
        totalPaise: result.bookSubtotalPaise,
        deliveryAddress: result.addressSnapshot,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCheckoutController = async (req, res, next) => {
  try {
    const result = await createCheckout({
      buyerId: req.user.id,
      addressId: req.body.addressId,
      idempotencyKey: req.body.idempotencyKey,
    });

    return res.status(201).json({
      success: true,
      message: "Checkout session created or retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
