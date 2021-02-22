const { response } = require("express");
const { Category } = require("../models");

const categoriesGetAll = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate({ path: "user", select: "name" })
      //.populate('user', 'name') solución profe
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const categoriesGetById = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate({
    path: "user",
    select: "name",
  });

  res.json(category);
};

const categoriesCreate = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${categoryDB.name} already exist!`,
    });
  }
  // Generar la data a guardar
  const data = {
    name,
    user: req.user._id,
  };
  const category = new Category(data);
  await category.save();
  res.status(201).json(category);
};

// actualizarCategoría - (solo nombre)
const categoriesUpdate = async (req, res = response) => {
  const { id } = req.params;
  // const { status, user, ...data } = req.body;

  const name = req.body.name.toUpperCase();
  const data = {
    name,
    user: req.user._id,
  };
  const dbCategory = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(dbCategory);
};

// borrarCategoria - cambiar estado a false
const categoriesDelete = async (req, res = response) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );
  res.json({ deletedCategory });
};

module.exports = {
  categoriesGetAll,
  categoriesCreate,
  categoriesGetById,
  categoriesUpdate,
  categoriesDelete,
};
