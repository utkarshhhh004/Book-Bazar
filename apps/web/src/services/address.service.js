import api from "./api";

const unwrapResponse = (response) => response.data?.data ?? response.data;

/**
 * Retrieve addresses belonging to the authenticated user.
 */
export const getAddresses = async () => {
  const response = await api.get("/addresses");
  return unwrapResponse(response);
};

/**
 * Create a new delivery address.
 */
export const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);
  return unwrapResponse(response);
};

/**
 * Replace an existing delivery address.
 */
export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/addresses/${addressId}`, addressData);

  return unwrapResponse(response);
};

/**
 * Delete an existing delivery address.
 */
export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return unwrapResponse(response);
};

/**
 * Set an address as the default delivery address.
 */
export const setDefaultAddress = async (addressId) => {
  const response = await api.patch(`/addresses/${addressId}/default`, {
    isDefault: true,
  });

  return unwrapResponse(response);
};
