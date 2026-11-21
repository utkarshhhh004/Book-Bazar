
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/address.service.js";

export const getAddressesController = async (req, res, next) => {
  try {
    const addresses = await getUserAddresses(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully.",
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const createAddressController = async (req, res, next) => {
  try {
    const address = await createAddress({
      userId: req.user.id,
      addressData: req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Delivery address created successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddressController = async (req, res, next) => {
  try {
    const address = await updateAddress({
      userId: req.user.id,
      addressId: req.params.addressId,
      addressData: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery address updated successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddressController = async (req, res, next) => {
  try {
    await deleteAddress({
      userId: req.user.id,
      addressId: req.params.addressId,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery address deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddressController = async (req, res, next) => {
  try {
    const address = await setDefaultAddress({
      userId: req.user.id,
      addressId: req.params.addressId,
    });

    return res.status(200).json({
      success: true,
      message: "Default delivery address updated successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};
