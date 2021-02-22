const { Router } = require("express");
const { check } = require("express-validator");
const {
  productsCreate,
  productsGetAll,
  productsGetById,
  productsUpdate,
  productsDelete,
} = require("../controllers/products");
const { validateJWT, validateFields } = require("../middlewares");
const {
  existProductById,
  existUserById,
  existCategoryById,
} = require("../helpers/db-validators");
const { isAdmin } = require("../middlewares/validate-roles");

const router = Router();

router.get("/", productsGetAll);

router.get(
  "/:id",
  [
    check("id", `Isn't a valid mongo ID`).isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  productsGetById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required!").not().isEmpty(),
    check("category", `Category hasn't a valid Mongo ID`).isMongoId(),
    check("category").custom(existCategoryById),
    validateFields,
  ],
  productsCreate
);

router.put(
  "/:id",
  [
    // Validación del JWT
    validateJWT,
    // Valida si el id del producto a actualizar corresponde a un Id de Mongo
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    // Valida si existe, en la base de datos, el producto con el id ingresado
    check("id").custom(existProductById),
    check("category", `Category hasn't a valid Mongo ID`).isMongoId(),
    check("category").custom(existCategoryById),
    // Middleware que atrapa los resultados de las validaciones
    validateFields,
  ],
  productsUpdate
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  productsDelete
);

module.exports = router;
