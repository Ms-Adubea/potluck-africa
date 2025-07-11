import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, User, DollarSign, CheckCircle, XCircle, AlertCircle, ChefHat, Package } from 'lucide-react';

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'Sarah Johnson',
      customerPhone: '+1-555-0123',
      mealName: 'Jollof Rice with Grilled Chicken',
      quantity: 2,
      totalAmount: 25.99,
      status: 'pending',
      orderTime: '2025-01-15T10:30:00',
      deliveryAddress: '123 Main St, Accra',
      specialInstructions: 'Extra spicy please, no onions',
      estimatedDelivery: '2025-01-15T12:00:00'
    },
    {
      id: 'ORD-002',
      customerName: 'Michael Chen',
      customerPhone: '+1-555-0456',
      mealName: 'Waakye with Fish',
      quantity: 1,
      totalAmount: 18.50,
      status: 'preparing',
      orderTime: '2025-01-15T11:15:00',
      deliveryAddress: '456 Oak Ave, East Legon',
      specialInstructions: '',
      estimatedDelivery: '2025-01-15T13:30:00'
    },
    {
      id: 'ORD-003',
      customerName: 'Emma Williams',
      customerPhone: '+1-555-0789',
      mealName: 'Banku with Tilapia',
      quantity: 3,
      totalAmount: 42.75,
      status: 'ready',
      orderTime: '2025-01-15T09:45:00',
      deliveryAddress: '789 Pine Rd, Tema',
      specialInstructions: 'Please include extra pepper sauce',
      estimatedDelivery: '2025-01-15T11:45:00'
    },
    {
      id: 'ORD-004',
      customerName: 'David Asante',
      customerPhone: '+233-24-123-4567',
      mealName: 'Kelewele with Plantain',
      quantity: 2,
      totalAmount: 15.00,
      status: 'completed',
      orderTime: '2025-01-15T08:20:00',
      deliveryAddress: '321 Cedar St, Kumasi',
      specialInstructions: '',
      estimatedDelivery: '2025-01-15T10:20:00'
    },
    {
      id: 'ORD-005',
      customerName: 'Grace Mensah',
      customerPhone: '+233-50-987-6543',
      mealName: 'Red Red with Fried Plantain',
      quantity: 1,
      totalAmount: 12.99,
      status: 'cancelled',
      orderTime: '2025-01-15T07:30:00',
      deliveryAddress: '654 Birch Ln, Tamale',
      specialInstructions: 'Customer cancelled - refund processed',
      estimatedDelivery: '2025-01-15T09:30:00'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredOrders.length} orders
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === option.value
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {option.label}
            {option.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeFilter === option.value
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Ordered at {formatTime(order.orderTime)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.customerPhone}</span>
                  </div>
                </div>

                {/* Meal Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{order.mealName}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Qty: {order.quantity}</span>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  {order.specialInstructions && (
                    <p className="text-sm text-gray-600 italic">
                      Note: {order.specialInstructions}
                    </p>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="flex items-start space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Expected by {formatTime(order.estimatedDelivery)}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Accept & Start Cooking
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <div className="flex-1 text-center py-2 text-sm text-gray-500">
                      Order {order.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChefOrders;