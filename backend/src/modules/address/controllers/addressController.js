import Address from "../models/addressModel.js";

// CREATE ADDRESS
export const createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USER ADDRESSES
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.user.id,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};