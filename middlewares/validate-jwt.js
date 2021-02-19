const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request!",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer el usuario que corresponde al uid
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token invalid! - user does not exist in DB",
      });
    }

    // Verificar si el estado del usuario autenticado es true (si no ha sido eliminado)
    if (!user.status) {
      return res.status(401).json({
        msg: "Token invalid! - user status: false",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token invalid!",
    });
  }
};

module.exports = {
  validateJWT,
};
