const Product = require('../model/product');

const getProducts = async (req, res) => {
  try {
    const { category, subcategory, type } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (type) filter.type = type;

    const productDocs = await Product.find(filter);

    if (productDocs.length === 0) {
      return res.status(404).json({ message: "No products found for given filters" });
    }

    res.status(200).json(productDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createProducts = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};  

module.exports = { getProducts ,createProducts};
