const Category = require("../models/Category");

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find ({});
  ctx.body = {categories: categories.map (mapCategory)};
};

function mapCategory (category) {
  return {
    id: category._id,
    title: category.title,
    subcategories: category.subcategories.map (mapSubCategory)
  };
}

function mapSubCategory (subCategory) {
  return {
    id: subCategory._id,
    title: subCategory.title
  };
}

