const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    // Verificar si el correo ya existe en BD
    let user = await User.findOne({ email });
    if (!user) {
      // Crear Usuario:
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };
      user = new User(data);
      await user.save();
    }
    // Si el usuario en BD
    if (!user.status) {
      return res.status(401).json({
        msg: "User is locked, talk to admin!",
      });
    }
    //Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Google Token invalid!",
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
