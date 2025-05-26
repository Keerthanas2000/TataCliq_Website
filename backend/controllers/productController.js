const Product = require('../model/product');
const getProducts = async (req, res) => {
  try {
    const { category, subcategory, type, brand, sort } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Case-sensitive filters
    if (category) filter.category = { $in: category.split(',') };
    if (subcategory) filter.subcategory = { $in: subcategory.split(',') };
    if (type) filter.type = { $in: type.split(',') };
    
    // Case-insensitive brand filter
    if (brand) {
      const brandRegex = brand.split(',').map(b => 
        new RegExp(`^${b.trim()}$`, 'i')
      );
      filter.brand = { $in: brandRegex };
    }

    // Build query
    let query = Product.find(filter);

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'lowToHigh':
          query = query.sort({ price: 1 });
          break;
        case 'highToLow':
          query = query.sort({ price: -1 });
          break;
        case 'newest':
          query = query.sort({ createdAt: -1 });
          break;
        case 'popularity':
        default:
          query = query.sort({ popularityScore: -1 });
      }
    }

    // Execute query
    const products = await query.exec();

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No products found matching your criteria",
        suggestions: "Try broadening your filters"
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching products",
      error: error.message 
    });
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
