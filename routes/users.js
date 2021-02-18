const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const {
  isValidRole,
  existEmail,
  existUserById,
} = require("../helpers/db-validators");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);
router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check(
      "password",
      "Password must contain at least six characters!"
    ).isLength({ min: 6 }),
    check("email", "Email is invalid!").isEmail(),
    check("email").custom(existEmail),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPost
);
router.put(
  "/:id",
  [
    check("id", `Isn't a valid ID`).isMongoId(),
    check("id").custom(existUserById),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPut
);
router.patch("/", usersPatch);
router.delete(
  "/:id",
  [
    check("id", `Isn't a valid ID`).isMongoId(),
    check("id").custom(existUserById),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
