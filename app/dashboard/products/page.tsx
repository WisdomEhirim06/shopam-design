'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Filter,
  Download,
  Package,
  AlertCircle,
} from 'lucide-react';

// Product type definition for TypeScript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'low_stock';
  image?: string;
  sku: string;
  createdAt: string;
}

// Sample initial products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'African Print Dress',
    description: 'Elegant traditional African print dress',
    price: 85.55,
    category: 'Clothing',
    stock: 15,
    status: 'active',
    sku: 'APD-001',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Pattern Basket Set',
    description: 'Handwoven African pattern basket set',
    price: 45.00,
    category: 'Home Decor',
    stock: 8,
    status: 'low_stock',
    sku: 'PBS-002',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Ankara Headwrap',
    description: 'Colorful Ankara fabric headwrap',
    price: 28.00,
    category: 'Accessories',
    stock: 42,
    status: 'active',
    sku: 'AHW-003',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Kente Cloth Scarf',
    description: 'Traditional Kente cloth scarf',
    price: 35.00,
    category: 'Accessories',
    stock: 0,
    status: 'inactive',
    sku: 'KCS-004',
    createdAt: '2024-02-10',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'active' as Product['status'],
    sku: '',
  });

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Handle Add Product
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      status: formData.status,
      sku: formData.sku,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts([newProduct, ...products]);
    resetForm();
    setIsAddModalOpen(false);
  };

  // Handle Edit Product
  const handleEditProduct = () => {
    if (!currentProduct) return;

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? {
            ...product,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            stock: parseInt(formData.stock),
            status: formData.status,
            sku: formData.sku,
          }
        : product
    );

    setProducts(updatedProducts);
    resetForm();
    setIsEditModalOpen(false);
    setCurrentProduct(null);
  };

  // Handle Delete Product
  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    setProducts(products.filter((product) => product.id !== currentProduct.id));
    setIsDeleteModalOpen(false);
    setCurrentProduct(null);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      status: product.status,
      sku: product.sku,
    });
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      status: 'active',
      sku: '',
    });
  };

  // Get status badge color
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'low_stock':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get status label
  const getStatusLabel = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'low_stock':
        return 'Low Stock';
      case 'inactive':
        return 'Inactive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-400">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Products</p>
            <Package size={20} className="text-crimson" />
          </div>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Active</p>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold">
            {products.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Low Stock</p>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold">
            {products.filter((p) => p.status === 'low_stock').length}
          </p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Out of Stock</p>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold">
            {products.filter((p) => p.stock === 0).length}
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-pitch">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
            <Download size={20} />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass border-white/10 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-crimson/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <Package size={24} className="text-crimson" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${
                          product.stock === 0
                            ? 'text-red-400'
                            : product.stock < 10
                            ? 'text-amber-400'
                            : 'text-green-400'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-gray-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="theme-card border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAddModalOpen ? 'Add New Product' : 'Edit Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg theme-btn-primary px-6 py-3 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    isAddModalOpen ? handleAddProduct() : handleEditProduct();
                  }}
                  className="space-y-4"
                >
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all resize-none"
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($) *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="0"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="e.g., Clothing"
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-medium mb-2">SKU *</label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                        placeholder="e.g., APD-001"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as Product['status'] })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
                    >
                      <option value="active" className="theme-modal">Active</option>
                      <option value="low_stock" className="theme-modal">Low Stock</option>
                      <option value="inactive" className="theme-modal">Inactive</option>
                    </select>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      <Save size={20} />
                      {isAddModalOpen ? 'Add Product' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setIsEditModalOpen(false);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCurrentProduct(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="theme-modal border-white/10 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <AlertCircle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Product</h2>
                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">{currentProduct.name}</span>?
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteProduct}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 theme-btn-primary rounded-lg font-medium transition-all"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setCurrentProduct(null);
                    }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}