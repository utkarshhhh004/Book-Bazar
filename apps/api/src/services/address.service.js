import mongoose from "mongoose";
import Address from "../models/Address.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateUserId = (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("Invalid user identifier.");
  }
};

const validateAddressId = (addressId) => {
  if (!mongoose.isValidObjectId(addressId)) {
    throw createError("Invalid address identifier.");
  }
};

const normalizeAddress = (data) => ({
  recipientName: data.recipientName,
  phone: data.phone,
  addressLine1: data.addressLine1,
  addressLine2: data.addressLine2 || "",
  landmark: data.landmark || "",
  city: data.city,
  state: data.state,
  postalCode: data.postalCode,
  country: data.country || "India",
});

/**
 * Retrieve all addresses belonging to a user.
 */
export const getUserAddresses = async (userId) => {
  validateUserId(userId);

  return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
};

/**
 * Create a new address.
 * The first address automatically becomes the default.
 */
export const createAddress = async ({ userId, addressData }) => {
  validateUserId(userId);

  const session = await mongoose.startSession();
  let createdAddress;

  try {
    await session.withTransaction(async () => {
      const existingCount = await Address.countDocuments({
        userId,
      }).session(session);

      const shouldBeDefault =
        addressData.isDefault === true || existingCount === 0;

      if (shouldBeDefault) {
        await Address.updateMany(
          { userId, isDefault: true },
          { $set: { isDefault: false } },
          { session },
        );
      }

      const [address] = await Address.create(
        [
          {
            userId,
            ...normalizeAddress(addressData),
            isDefault: shouldBeDefault,
          },
        ],
        { session },
      );

      createdAddress = address;
    });

    return createdAddress;
  } finally {
    await session.endSession();
  }
};

/**
 * Update an existing address.
 *
 * Maintains a valid default address:
 * - Explicit true promotes this address.
 * - Explicit false promotes another address if this was the default.
 * - The only saved address remains the default.
 * - An omitted isDefault preserves the current default status.
 */
export const updateAddress = async ({ userId, addressId, addressData }) => {
  validateUserId(userId);
  validateAddressId(addressId);

  const session = await mongoose.startSession();
  let updatedAddress;

  try {
    await session.withTransaction(async () => {
      const existingAddress = await Address.findOne({
        _id: addressId,
        userId,
      }).session(session);

      if (!existingAddress) {
        throw createError("Address not found.", 404);
      }

      const wasDefault = existingAddress.isDefault;
      let shouldBeDefault = wasDefault;

      if (addressData.isDefault === true) {
        shouldBeDefault = true;

        await Address.updateMany(
          {
            userId,
            isDefault: true,
            _id: { $ne: addressId },
          },
          { $set: { isDefault: false } },
          { session },
        );
      } else if (addressData.isDefault === false && wasDefault) {
        const nextDefault = await Address.findOne({
          userId,
          _id: { $ne: addressId },
        })
          .sort({ createdAt: -1 })
          .session(session);

        if (nextDefault) {
          nextDefault.isDefault = true;
          await nextDefault.save({ session });

          shouldBeDefault = false;
        } else {
          // Never leave a user with no default address.
          shouldBeDefault = true;
        }
      }

      Object.assign(existingAddress, normalizeAddress(addressData));
      existingAddress.isDefault = shouldBeDefault;

      await existingAddress.save({ session });

      updatedAddress = existingAddress;
    });

    return updatedAddress;
  } finally {
    await session.endSession();
  }
};

/**
 * Delete an address.
 * If the deleted address was the default, promote the newest remaining address.
 */
export const deleteAddress = async ({ userId, addressId }) => {
  validateUserId(userId);
  validateAddressId(addressId);

  const session = await mongoose.startSession();
  let deletedAddress;

  try {
    await session.withTransaction(async () => {
      const address = await Address.findOneAndDelete({
        _id: addressId,
        userId,
      }).session(session);

      if (!address) {
        throw createError("Address not found.", 404);
      }

      deletedAddress = address;

      if (address.isDefault) {
        const nextDefault = await Address.findOne({ userId })
          .sort({ createdAt: -1 })
          .session(session);

        if (nextDefault) {
          nextDefault.isDefault = true;
          await nextDefault.save({ session });
        }
      }
    });

    return deletedAddress;
  } finally {
    await session.endSession();
  }
};

/**
 * Set an address as the user's default address.
 */
export const setDefaultAddress = async ({ userId, addressId }) => {
  validateUserId(userId);
  validateAddressId(addressId);

  const session = await mongoose.startSession();
  let defaultAddress;

  try {
    await session.withTransaction(async () => {
      const address = await Address.findOne({
        _id: addressId,
        userId,
      }).session(session);

      if (!address) {
        throw createError("Address not found.", 404);
      }

      await Address.updateMany(
        {
          userId,
          isDefault: true,
          _id: { $ne: addressId },
        },
        { $set: { isDefault: false } },
        { session },
      );

      address.isDefault = true;
      await address.save({ session });

      defaultAddress = address;
    });

    return defaultAddress;
  } finally {
    await session.endSession();
  }
};
