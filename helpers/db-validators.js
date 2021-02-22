const { User, Category, Product, Role } = require("../models");

const isValidRole = async (role = "") => {
  const exists = await Role.findOne({ role });
  if (!exists) {
    throw new Error(`Role '${role}' isn't registered on database!`);
  }
};

const existEmail = async (email = "") => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw new Error("Email already exist!");
  }
};

const existUserById = async (id) => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error(`User id doesn't exist in database!`);
  }
};

const existCategoryById = async (id) => {
  const exists = await Category.findById(id);
  if (!exists) {
    throw new Error(`Category id doesn't exist in database!`);
  }
};

const existProductById = async (id) => {
  const exists = await Product.findById(id);
  if (!exists) {
    throw new Error(`Product id doesn't exist in database!`);
  }
};

module.exports = {
  isValidRole,
  existEmail,
  existUserById,
  existCategoryById,
  existProductById,
};
