const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { _id, __v, status, user: usr, ...category } = this.toObject();
  category.uid = _id;
  category.user = {
    name: usr.name,
    uid: usr._id,
  };
  return category;
};

module.exports = model("Category", CategorySchema);
