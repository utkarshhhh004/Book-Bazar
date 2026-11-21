
import api from "./api";

const getResponseData = (response) => {
  return response.data?.data ?? response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return getResponseData(response);
};

export const addCartItem = async ({ listingId, quantity = 1 }) => {
  const response = await api.post("/cart/items", {
    listingId,
    quantity,
  });

  return getResponseData(response);
};

export const updateCartItem = async ({ listingId, quantity }) => {
  const response = await api.patch(
    `/cart/items/${listingId}`,
    { quantity }
  );

  return getResponseData(response);
};

export const removeCartItem = async (listingId) => {
  const response = await api.delete(`/cart/items/${listingId}`);
  return getResponseData(response);
};

export const clearCart = async () => {
  const response = await api.delete("/cart");
  return getResponseData(response);
};
