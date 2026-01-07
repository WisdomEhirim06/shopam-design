'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  X,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
} from 'lucide-react';

// Order type definition
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  items: string[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'transfer' | 'cash';
  date: string;
  shippingAddress?: string;
}

// Sample orders data
const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#SH001',
    customer: {
      name: 'Ada Johnson',
      email: 'ada.johnson@email.com',
    },
    items: ['African Print Dress', 'Headwrap Set'],
    total: 115.50,
    status: 'processing',
    paymentMethod: 'card',
    date: '2024-01-15',
    shippingAddress: '123 Lagos Street, Victoria Island, Lagos',
  },
  {
    id: '2',
    orderNumber: '#SH002',
    customer: {
      name: 'Kenny Adeleke',
      email: 'kenny.adeleke@email.com',
    },
    items: ['Handwoven Basket', 'Table Runner'],
    total: 75.00,
    status: 'pending',
    paymentMethod: 'transfer',
    date: '2024-01-14',
    shippingAddress: '45 Banana Island, Ikoyi, Lagos',
  },
  {
    id: '3',
    orderNumber: '#SH003',
    customer: {
      name: 'David Okon',
      email: 'david.okon@email.com',
    },
    items: ['Shea Butter Natural'],
    total: 43.75,
    status: 'shipped',
    paymentMethod: 'card',
    date: '2024-01-13',
    shippingAddress: '78 Independence Ave, Abuja',
  },
  {
    id: '4',
    orderNumber: '#SH004',
    customer: {
      name: 'Fatima Hassan',
      email: 'fatima.hassan@email.com',
    },
    items: ['Kente Cloth Scarf', 'Traditional Jewelry'],
    total: 122.00,
    status: 'delivered',
    paymentMethod: 'card',
    date: '2024-01-10',
    shippingAddress: '56 Port Harcourt Road, Rivers State',
  },
  {
    id: '5',
    orderNumber: '#SH005',
    customer: {
      name: 'Chidi Eze',
      email: 'chidi.eze@email.com',
    },
    items: ['Ankara Print Set'],
    total: 85.60,
    status: 'cancelled',
    paymentMethod: 'cash',
    date: '2024-01-12',
    shippingAddress: '90 Enugu Street, Enugu State',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  // Open order details
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Update selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // Get status color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  // Get status icon
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
    }
  };

  // Get payment method icon/label
  const getPaymentLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'card':
        return 'Card';
      case 'transfer':
        return 'Transfer';
      case 'cash':
        return 'Cash';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-400">Keep your customers happy with quick order processing!</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="glass border-white/10 rounded-xl p-4 hover:border-crimson/30 transition-all cursor-pointer">
          <p className="text-sm text-gray-400 mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4 hover:border-amber-500/30 transition-all cursor-pointer">
          <p className="text-sm text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all cursor-pointer">
          <p className="text-sm text-gray-400 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all cursor-pointer">
          <p className="text-sm text-gray-400 mb-1">Shipped</p>
          <p className="text-2xl font-bold text-purple-400">{stats.shipped}</p>
        </div>
        <div className="glass border-white/10 rounded-xl p-4 hover:border-green-500/30 transition-all cursor-pointer">
          <p className="text-sm text-gray-400 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
        </div>
      </motion.div>

      {/* Search and Filter */}
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
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 transition-all"
            >
              <option value="all" className="theme-modal">All Orders</option>
              <option value="pending" className="theme-modal">Pending</option>
              <option value="processing" className="theme-modal">Processing</option>
              <option value="shipped" className="theme-modal">Shipped</option>
              <option value="delivered" className="theme-modal">Delivered</option>
              <option value="cancelled" className="theme-modal">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-4"
      >
        {filteredOrders.length === 0 ? (
          <div className="glass border-white/10 rounded-xl p-12 text-center">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="glass border-white/10 rounded-xl p-6 hover:border-crimson/30 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Left: Customer Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson/40 to-orange-600/40 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {order.customer.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.customer.email}</p>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Items:</span> {order.items.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Order Details */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-400 mb-1">Amount</p>
                    <p className="text-xl font-bold text-crimson">${order.total.toFixed(2)}</p>
                  </div>

                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  </div>

                  <div className="text-right hidden lg:block">
                    <p className="text-sm text-gray-400 mb-1">Payment</p>
                    <p className="text-sm">{getPaymentLabel(order.paymentMethod)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="p-3 bg-crimson/20 hover:bg-crimson rounded-lg transition-all group"
                      title="View Details"
                    >
                      <Eye size={18} className="text-crimson group-hover:text-white" />
                    </button>

                    {/* Quick Status Update */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-sm font-medium transition-all"
                      >
                        Process
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white rounded-lg text-sm font-medium transition-all"
                      >
                        Ship
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
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
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Order Details</h2>
                    <p className="text-gray-400">{selectedOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crimson/20 rounded-lg">
                        <User size={20} className="text-crimson" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Customer</p>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crimson/20 rounded-lg">
                        <Calendar size={20} className="text-crimson" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Order Date</p>
                        <p className="font-medium">
                          {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Amount */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crimson/20 rounded-lg">
                        <DollarSign size={20} className="text-crimson" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total Amount</p>
                        <p className="font-bold text-2xl text-crimson">
                          ${selectedOrder.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-crimson/20 rounded-lg">
                        <CreditCard size={20} className="text-crimson" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Payment Method</p>
                        <p className="font-medium capitalize">
                          {getPaymentLabel(selectedOrder.paymentMethod)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-crimson/20 rounded-lg">
                        <MapPin size={20} className="text-crimson" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Shipping Address</p>
                        <p className="font-medium">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-crimson/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-crimson" />
                        </div>
                        <p className="font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 font-medium">Update Order Status:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                      disabled={selectedOrder.status === 'pending'}
                      className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      disabled={selectedOrder.status === 'processing'}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      disabled={selectedOrder.status === 'shipped'}
                      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Shipped
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      disabled={selectedOrder.status === 'delivered'}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}