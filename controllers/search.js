const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Product, Category } = require("../models");

const allowedCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }
  const regex = new RegExp(term, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  res.json({
    count: users.length,
    results: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }
  const regex = new RegExp(term, "i");
  const categories = await Category.find({
    name: regex,
    status: true,
  });
  res.json({
    count: categories.length,
    results: categories,
  });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const exists = await Category.findById(term);
    if (exists) {
      const products = await Product.find({
        category: ObjectId(term),
        status: true,
      }).populate("category", "name");
      return res.json({
        results: products ? [products] : [],
      });
    }
    const product = await Product.findById(term).populate("category", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }
  const regex = new RegExp(term, "i");
  const products = await Product.find({
    name: regex,
    status: true,
  }).populate("category", "name");
  res.json({
    count: products.length,
    results: products,
  });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `Collections allowed are: ${allowedCollections}` });
  }
  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: "Option not implemented on backend!",
      });
  }
};

module.exports = {
  search,
};
