const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
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
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`User id doesn't exist!`);
  }
};

module.exports = {
  isValidRole,
  existEmail,
  existUserById,
};
