
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
        shippingTotalPaise: null,
        gatewayFeePaise: null,
        taxTotalPaise: null,
        totalPaise: null,
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
    });

    return res.status(201).json({
      success: true,
      message: "Checkout session created and inventory reserved.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
