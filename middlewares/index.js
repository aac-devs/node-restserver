const validateFields = require("./validate-fields");
const validateJWT = require("./validate-jwt");
const validateRoles = require("./validate-roles");
const validateFileUpload = require("./validate-file");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
  ...validateFileUpload,
};
