
import {
  createSellerListing,
  getSellerListings,
  updateSellerListing,
  updateSellerListingStatus,
  archiveSellerListing,
  submitCatalogueBook,
} from "../services/seller.service.js";

export const createListingController = async (req, res, next) => {
  try {
    const result = await createSellerListing(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: result.publicationMessage,
      data: result.listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListingsController = async (req, res, next) => {
  try {
    const result = await getSellerListings(req.user.id, req.query);

    return res.status(200).json({
      success: true,
      message: "Your listings were retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListingController = async (req, res, next) => {
  try {
    const result = await updateSellerListing(
      req.user.id,
      req.params.listingId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListingStatusController = async (req, res, next) => {
  try {
    const result = await updateSellerListingStatus(
      req.user.id,
      req.params.listingId,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: `Listing ${req.body.status === "active" ? "activated" : "paused"} successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const archiveListingController = async (req, res, next) => {
  try {
    const result = await archiveSellerListing(
      req.user.id,
      req.params.listingId,
    );

    return res.status(200).json({
      success: true,
      message: "Listing archived successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const submitCatalogueBookController = async (req, res, next) => {
  try {
    const result = await submitCatalogueBook(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Book submitted to the catalogue for review.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
