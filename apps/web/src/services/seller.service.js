import api from "./api";

// ============================================
// SELLER ACCOUNT
// ============================================

export const activateSeller = async () => {
  const response = await api.post("/seller/activate");

  return response.data?.data ?? response.data;
};

export const getSellerOverview = async () => {
  const response = await api.get("/seller/me");

  return response.data?.data ?? response.data;
};

export const saveSellerVerificationDraft = async (payload) => {
  const response = await api.put("/seller/verification", payload);

  return response.data?.data ?? response.data;
};

// ============================================
// SELLER LISTINGS
// ============================================

export const getMyListings = async (params = {}) => {
  const response = await api.get("/listings/seller/me", {
    params,
  });

  return response.data?.data ?? response.data;
};

export const createListing = async (payload) => {
  const response = await api.post("/listings", payload);

  return response.data?.data ?? response.data;
};

export const updateListing = async (listingId, payload) => {
  const response = await api.patch(`/listings/${listingId}`, payload);

  return response.data?.data ?? response.data;
};

export const updateListingStatus = async (listingId, status) => {
  const response = await api.patch(`/listings/${listingId}/status`, {
    status,
  });

  return response.data?.data ?? response.data;
};

export const archiveListing = async (listingId) => {
  const response = await api.delete(`/listings/${listingId}`);

  return response.data?.data ?? response.data;
};

// ============================================
// BOOK CATALOGUE
// ============================================

export const submitCatalogueBook = async (payload) => {
  const response = await api.post("/listings/catalogue-requests", payload);

  return response.data?.data ?? response.data;
};

// ============================================
// BOOK IMAGE UPLOAD
// ============================================

export const uploadBookImages = async (files) => {
  if (!Array.isArray(files) || files.length < 1 || files.length > 2) {
    throw new Error("Upload one or two book photographs.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const maxSize = 5 * 1024 * 1024;

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG and WEBP photographs are allowed.");
    }

    if (file.size > maxSize) {
      throw new Error("Each photograph must be smaller than 5 MB.");
    }
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post("/uploads/book-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const result = response.data?.data ?? response.data;

  const uploadedImages = result?.images;

  if (!Array.isArray(uploadedImages)) {
    throw new Error("The server returned an invalid image upload response.");
  }

  return uploadedImages;
};
