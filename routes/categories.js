const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT, isAdmin } = require("../middlewares");

const {
  categoriesGetAll,
  categoriesCreate,
  categoriesGetById,
  categoriesUpdate,
  categoriesDelete,
} = require("../controllers/categories");
const { validateFields } = require("../middlewares/validate-fields");
const { existCategoryById } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorías - público
router.get("/", categoriesGetAll);

// Obtener una categoría por id - público
router.get(
  "/:id",
  [
    check("id", `Isn't a valid ID`).isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  categoriesGetById
);

// Crear categoría - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required!").not().isEmpty(),
    validateFields,
  ],
  categoriesCreate
);

// Actualizar categoría por id - privado - cualquier persona con un token válido
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name is required!").not().isEmpty(),
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  categoriesUpdate
);

// Borrar categoría por id - privado - sólo Admin
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", `Isn't a valid Mongo ID`).isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  categoriesDelete
);

module.exports = router;
