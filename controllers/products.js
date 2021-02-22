const { response } = require("express");
const { Product } = require("../models");

const productsGetAll = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate({ path: "category", select: "name" })
      .populate({ path: "user", select: "name" })
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

const productsGetById = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "category",
      select: "name",
    });

  res.json(product);
};

const productsCreate = async (req, res = response) => {
  // Se descarta los campos de status y user (si son enviados)
  const { status, user, name: n, ...rest } = req.body;
  const name = n.toUpperCase();
  // Verifica si ya existe, por nombre, el producto a guardar
  const productDB = await Product.findOne({ name });
  if (productDB) {
    return res.status(400).json({
      msg: `Product ${productDB.name} already exist!`,
    });
  }
  // Construye la data que se va a guardar en DB
  const data = {
    name,
    status: true,
    user: req.user._id,
    ...rest,
  };
  const product = new Product(data);
  // Guarda el producto en DB
  await product.save();
  res.json(product);
};

const productsUpdate = async (req, res = response) => {
  const { id } = req.params;
  const {
    name: n,
    price: p,
    description: d,
    available: a,
    category: c,
  } = req.body;

  const product = await Product.findById(id);
  const { __v, ...data } = product._doc;
  data.name = n ? n.toUpperCase() : product.name;
  data.price = p ? p : product.price;
  data.description = d ? d : product.description;
  data.available = a !== undefined ? a : product.available;
  data.category = c;

  // Actualiza el registro
  const dbProduct = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(dbProduct);
};

const productsDelete = async (req, res = response) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );
  res.json(deletedProduct);
};

module.exports = {
  productsCreate,
  productsGetAll,
  productsGetById,
  productsUpdate,
  productsDelete,
};
