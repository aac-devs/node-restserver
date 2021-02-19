const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verificar si el email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password are invalid - email",
      });
    }
    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(400).json({
        msg: "User / Password are invalid - status: false",
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password are invalid - password",
      });
    }
    // Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Something went wrong!",
    });
  }
};

module.exports = {
  login,
};
