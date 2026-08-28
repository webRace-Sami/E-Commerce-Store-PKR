"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateStock = exports.updateProduct = exports.createProduct = exports.getCategories = exports.getProductById = exports.getProducts = void 0;
const dataStore_1 = require("../store/dataStore");
// Get All Products (Filter, Search, Sort)
const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, inStock, isOffer, isFeatured, sort } = req.query;
        let filtered = [...dataStore_1.store.products];
        // Search by name or description
        if (search && typeof search === 'string') {
            const q = search.toLowerCase().trim();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        // Filter by category
        if (category && typeof category === 'string' && category !== 'All') {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        // Filter by price range (PKR)
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }
        // Filter by stock status
        if (inStock === 'true') {
            filtered = filtered.filter(p => p.stock > 0);
        }
        // Filter by offer status
        if (isOffer === 'true') {
            filtered = filtered.filter(p => p.isOffer === true);
        }
        // Filter by featured
        if (isFeatured === 'true') {
            filtered = filtered.filter(p => p.isFeatured === true);
        }
        // Sorting
        if (sort === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        }
        else if (sort === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }
        else if (sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }
        else {
            // Default: newest first
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        res.json({
            success: true,
            count: filtered.length,
            products: filtered
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
// Get single product
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = dataStore_1.store.products.find(p => p._id === id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        res.json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductById = getProductById;
// Get categories with item count
const getCategories = async (_req, res) => {
    try {
        const categoryCounts = {};
        dataStore_1.store.products.forEach(p => {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });
        const list = Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count
        }));
        res.json({ success: true, categories: list });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCategories = getCategories;
// Admin: Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, images, stock, isFeatured, isOffer, offerTag, specifications } = req.body;
        if (!name || !price || !category) {
            res.status(400).json({ success: false, message: 'Please provide product name, price (in PKR), and category.' });
            return;
        }
        const numPrice = Number(price);
        const numOriginal = originalPrice ? Number(originalPrice) : undefined;
        let discountPct = undefined;
        if (numOriginal && numOriginal > numPrice) {
            discountPct = Math.round(((numOriginal - numPrice) / numOriginal) * 100);
        }
        const newProduct = {
            _id: `prod_${Date.now()}`,
            name,
            description: description || '',
            price: numPrice,
            originalPrice: numOriginal,
            discountPercentage: discountPct,
            category,
            images: Array.isArray(images) && images.length > 0 ? images : [
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
            ],
            stock: Number(stock) || 0,
            isFeatured: !!isFeatured,
            isOffer: !!isOffer,
            offerTag: offerTag || '',
            rating: 5.0,
            numReviews: 1,
            specifications: specifications || {},
            createdAt: new Date()
        };
        dataStore_1.store.products.unshift(newProduct);
        dataStore_1.store.persist();
        res.status(201).json({
            success: true,
            message: 'Product created successfully in catalog!',
            product: newProduct
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
// Admin: Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dataStore_1.store.products.findIndex(p => p._id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        const existing = dataStore_1.store.products[index];
        const { name, description, price, originalPrice, category, images, stock, isFeatured, isOffer, offerTag, specifications } = req.body;
        const numPrice = price !== undefined ? Number(price) : existing.price;
        const numOriginal = originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice;
        let discountPct = undefined;
        if (numOriginal && numOriginal > numPrice) {
            discountPct = Math.round(((numOriginal - numPrice) / numOriginal) * 100);
        }
        const updated = {
            ...existing,
            name: name ?? existing.name,
            description: description ?? existing.description,
            price: numPrice,
            originalPrice: numOriginal,
            discountPercentage: discountPct,
            category: category ?? existing.category,
            images: Array.isArray(images) && images.length > 0 ? images : existing.images,
            stock: stock !== undefined ? Number(stock) : existing.stock,
            isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured,
            isOffer: isOffer !== undefined ? !!isOffer : existing.isOffer,
            offerTag: offerTag !== undefined ? offerTag : existing.offerTag,
            specifications: specifications ?? existing.specifications,
            updatedAt: new Date()
        };
        dataStore_1.store.products[index] = updated;
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: 'Product details updated successfully!',
            product: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
// Admin: Quick Update Stock
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const product = dataStore_1.store.products.find(p => p._id === id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        if (stock === undefined || isNaN(Number(stock))) {
            res.status(400).json({ success: false, message: 'Please provide a valid stock integer.' });
            return;
        }
        product.stock = Math.max(0, Number(stock));
        product.updatedAt = new Date();
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: `Stock for "${product.name}" updated to ${product.stock} units.`,
            product
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateStock = updateStock;
// Admin: Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dataStore_1.store.products.findIndex(p => p._id === id);
        if (index === -1) {
            res.status(404).json({ success: false, message: 'Product not found.' });
            return;
        }
        const removed = dataStore_1.store.products.splice(index, 1)[0];
        dataStore_1.store.persist();
        res.json({
            success: true,
            message: `Product "${removed.name}" deleted successfully.`,
            productId: id
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
