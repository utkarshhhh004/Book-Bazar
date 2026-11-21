
import api from "./api";

const unwrapResponse = (response) => response.data?.data ?? response.data;

export const previewCheckout = async (addressId) => {
  const response = await api.post("/checkout/preview", {
    addressId,
  });

  return unwrapResponse(response);
};

export const createCheckout = async (addressId, idempotencyKey) => {
  const response = await api.post("/checkout/session", {
    addressId,
    idempotencyKey,
  });

  return unwrapResponse(response);
};
