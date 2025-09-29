// src/context/orderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders debe ser usado dentro de un OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Cargar pedidos desde localStorage al inicializar
  useEffect(() => {
    loadOrders();
  }, []);

  // Cargar pedidos del almacenamiento local
  const loadOrders = () => {
    try {
      setLoading(true);
      const storedOrders = localStorage.getItem('fiofibras_orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar pedidos en localStorage
  const saveOrders = (ordersToSave) => {
    try {
      localStorage.setItem('fiofibras_orders', JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Error guardando pedidos:', error);
    }
  };

  // Crear un nuevo pedido
  const createOrder = (orderData) => {
    try {
      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'confirmado',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días
        ...orderData
      };

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      setCurrentOrder(newOrder);

      return newOrder;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  };

  // Obtener un pedido por ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === parseInt(orderId));
  };

  // Obtener pedidos por estado
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  // Actualizar estado del pedido
  const updateOrderStatus = (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === parseInt(orderId) 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      
      setOrders(updatedOrders);
      saveOrders(updatedOrders);

      // Si es el pedido actual, actualizarlo también
      if (currentOrder && currentOrder.id === parseInt(orderId)) {
        setCurrentOrder({ ...currentOrder, status: newStatus });
      }

      return true;
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error);
      return false;
    }
  };

  // Cancelar pedido
  const cancelOrder = (orderId, reason = '') => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === parseInt(orderId) 
          ? { 
              ...order, 
              status: 'cancelado', 
              cancelReason: reason,
              canceledAt: new Date().toISOString()
            }
          : order
      );
      
      setOrders(updatedOrders);
      saveOrders(updatedOrders);

      return true;
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      return false;
    }
  };

  // Obtener estadísticas de pedidos
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      confirmados: 0,
      enviados: 0,
      entregados: 0,
      cancelados: 0,
      totalAmount: 0
    };

    orders.forEach(order => {
      switch (order.status) {
        case 'confirmado':
          stats.confirmados++;
          break;
        case 'enviado':
        case 'en_camino':
          stats.enviados++;
          break;
        case 'entregado':
          stats.entregados++;
          break;
        case 'cancelado':
          stats.cancelados++;
          break;
        default:
          break;
      }

      if (order.status !== 'cancelado' && order.totals?.total) {
        stats.totalAmount += order.totals.total;
      }
    });

    return stats;
  };

  // Obtener pedidos recientes (últimos 30 días)
  const getRecentOrders = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return orders.filter(order => 
      new Date(order.date) >= thirtyDaysAgo
    );
  };

  // Buscar pedidos
  const searchOrders = (query) => {
    if (!query.trim()) return orders;

    const searchTerm = query.toLowerCase();
    return orders.filter(order => 
      order.id.toString().includes(searchTerm) ||
      order.customer?.firstName?.toLowerCase().includes(searchTerm) ||
      order.customer?.lastName?.toLowerCase().includes(searchTerm) ||
      order.customer?.email?.toLowerCase().includes(searchTerm) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm)
      )
    );
  };

  // Limpiar pedidos antiguos (opcional)
  const clearOldOrders = (daysOld = 365) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const filteredOrders = orders.filter(order => 
        new Date(order.date) >= cutoffDate
      );

      setOrders(filteredOrders);
      saveOrders(filteredOrders);

      return orders.length - filteredOrders.length; // Número de pedidos eliminados
    } catch (error) {
      console.error('Error limpiando pedidos antiguos:', error);
      return 0;
    }
  };

  // Exportar pedidos (para respaldo)
  const exportOrders = () => {
    try {
      const dataStr = JSON.stringify(orders, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `FioFibras_Pedidos_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      return true;
    } catch (error) {
      console.error('Error exportando pedidos:', error);
      return false;
    }
  };

  // Importar pedidos (para restaurar respaldo)
  const importOrders = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedOrders = JSON.parse(e.target.result);
          
          if (Array.isArray(importedOrders)) {
            // Combinar con pedidos existentes, evitando duplicados
            const combinedOrders = [...orders];
            
            importedOrders.forEach(importedOrder => {
              const exists = combinedOrders.some(order => order.id === importedOrder.id);
              if (!exists) {
                combinedOrders.push(importedOrder);
              }
            });

            const sortedOrders = combinedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setOrders(sortedOrders);
            saveOrders(sortedOrders);
            
            resolve(importedOrders.length);
          } else {
            reject(new Error('Formato de archivo inválido'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Error leyendo el archivo'));
      reader.readAsText(file);
    });
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener el siguiente estado del pedido
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'confirmado': 'procesando',
      'procesando': 'enviado',
      'enviado': 'en_camino',
      'en_camino': 'entregado',
      'entregado': null,
      'cancelado': null
    };

    return statusFlow[currentStatus] || null;
  };

  // Obtener el color del estado
  const getStatusColor = (status) => {
    const colors = {
      'confirmado': '#28a745',
      'procesando': '#ffc107',
      'enviado': '#17a2b8',
      'en_camino': '#fd7e14',
      'entregado': '#28a745',
      'cancelado': '#dc3545'
    };

    return colors[status] || '#6c757d';
  };

  // Obtener el texto del estado
  const getStatusText = (status) => {
    const texts = {
      'confirmado': 'Confirmado',
      'procesando': 'Procesando',
      'enviado': 'Enviado',
      'en_camino': 'En Camino',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };

    return texts[status] || 'Desconocido';
  };

  const value = {
    // Estado
    orders,
    loading,
    currentOrder,
    setCurrentOrder,
    
    // Acciones CRUD
    createOrder,
    getOrderById,
    getOrdersByStatus,
    updateOrderStatus,
    cancelOrder,
    loadOrders,
    
    // Búsqueda y filtros
    searchOrders,
    getRecentOrders,
    
    // Estadísticas
    getOrderStats,
    
    // Utilidades
    formatDate,
    getNextStatus,
    getStatusColor,
    getStatusText,
    
    // Importar/Exportar
    exportOrders,
    importOrders,
    clearOldOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;