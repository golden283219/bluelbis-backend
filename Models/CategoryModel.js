const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  name: {
    type: String,
    default: "",
    required: true,
    minLength: 3,
    maxLength: 255,
    lowercase: true,
  },
  image: { type: String, default: "" },
  active: { type: Boolean, default: true },
  removed: { type: Boolean, default: false },
});

class CategoryClass {
  static async isExists(category) {
    var result = false;
    const data = await this.findOne({ name: category }).exec();
    if (data) result = true;
    return result;
  }
  static async isExistsforModify(category, id) {
    var result = false;
    const data = await this.findOne({ name: category, _id : { $ne: id } }).exec();
    if (data) result = true;
    return result;
  }
  static async isExistsById(id) {
    var result = false;
    const data = await this.findOne({ _id: id }).exec();
    if (data) result = true;
    return result;
  }
}

CategorySchema.loadClass(CategoryClass);

const Categories = mongoose.model("Categories", CategorySchema);
module.exports = Categories;
