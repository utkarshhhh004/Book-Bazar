
import api from "./api";

const getResponseData = (response) =>
  response.data?.data ?? response.data;

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return getResponseData(response);
};

export const addWishlistItem = async (bookId) => {
  const response = await api.post("/wishlist/items", {
    bookId,
  });

  return getResponseData(response);
};

export const removeWishlistItem = async (bookId) => {
  const response = await api.delete(
    `/wishlist/items/${bookId}`,
  );

  return getResponseData(response);
};
