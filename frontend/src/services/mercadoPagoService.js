import apiClient from '../api';


/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {number} direccionId
 * @returns {Promise}
 */
export const crearPreferenciaPago = async (direccionId) => {
    try {
        const response = await apiClient.post('/pagos/crear-preferencia/', {
            direccion_id: direccionId,
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear preferencia de pago:', error);
        throw error;
    }
};

/**
 * Obtiene el detalle de una orden específica
 * @param {number} ordenId - ID de la orden
 * @returns {Promise} - Retorna los datos de la orden
 */
export const obtenerDetalleOrden = async (ordenId) => {
    try {
        const response = await apiClient.get(`/ordenes/${ordenId}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle de orden:', error);
        throw error;
    }
};