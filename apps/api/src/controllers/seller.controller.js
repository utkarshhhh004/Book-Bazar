import {
  activateSeller,
  getSellerOverview,
  saveSellerVerificationDraft,
} from "../services/seller.service.js";

/**
 * Activate seller capability on the authenticated user's account.
 * POST /api/v1/seller/activate
 */
export const activateSellerController = async (req, res, next) => {
  try {
    const result = await activateSeller(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Seller capability activated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve the authenticated seller's dashboard overview.
 * GET /api/v1/seller/me
 */
export const getSellerOverviewController = async (req, res, next) => {
  try {
    const result = await getSellerOverview(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Seller overview retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update the authenticated seller's verification draft.
 * PUT /api/v1/seller/verification
 */
export const saveSellerVerificationDraftController = async (req, res, next) => {
  try {
    const result = await saveSellerVerificationDraft(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Seller verification draft saved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
