const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({
    name,
    email,
    password,
    role,
  });

  // Encriptar la contraseña:
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await user.save();
  res.json(user);
};

const usersPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  // TODO validar contra base de datos:
  if (password) {
    // Encriptar la contraseña:
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  // Actualizar en BD
  const dbUser = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json(dbUser);
};

const usersPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndUpdate(id, { status: false });
  // const authUser = req.user;

  res.json({ deletedUser });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
