const { request, response } = require("express");

const isAdmin = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg:
        "You are trying to verify the role without validating the token first!",
    });
  }
  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} does not have administrator privileges - You can't do it!`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg:
          "You are trying to verify the role without validating the token first!",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of this roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdmin,
  hasRole,
};
