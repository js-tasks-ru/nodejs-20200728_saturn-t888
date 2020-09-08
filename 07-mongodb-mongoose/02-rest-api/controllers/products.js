const mongooseBeautifulUniqueValidation = require("mongoose-beautiful-unique-validation");
const Product = require("../models/Product");
const url = require ('url');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const id = !!(url.parse (ctx.request.url).query) ? url.parse (ctx.request.url).query.slice (12) : null;
  const product = !!id ? await Product.find ({subcategory: id}) : await Product.find ();
  
  ctx.body = {products: product.map (mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = { };
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById (ctx.params.id);
  if (!product) ctx.throw (404, 'Not found');
  
  ctx.body = {product: mapProduct (product)};
};

function mapProduct (product) {
  return {
    id: product._id,
    title: product.title,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    images: product.images
  };
}