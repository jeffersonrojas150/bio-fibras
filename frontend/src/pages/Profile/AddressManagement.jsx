import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaStar, FaRegStar } from 'react-icons/fa';
import apiClient from '../../api';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        agencia_recojo: '',
        direccion_agencia: '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Recojo en Agencia',
        direccion_completo: '',
        es_principal: false,
    });
    const [editingId, setEditingId] = useState(null); // Para saber si estamos editando o creando

    // Función para obtener las direcciones
    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/direcciones/');
            setAddresses(response.data.results || response.data);
        } catch (err) {
            setError('No se pudieron cargar tus direcciones.');
        } finally {
            setLoading(false);
        }
    };

    // Cargar direcciones cuando el componente se monta
    useEffect(() => {
        fetchAddresses();
    }, []);

    const resetForm = () => {
        setFormData({
            nombres: '',
            apellidos: '',
            dni: '',
            telefono: '',
            agencia_recojo: '',
            direccion_agencia: '',
            departamento: 'Lima',
            provincia: 'Lima',
            distrito: 'Recojo en Agencia',
            direccion_completo: '',
            es_principal: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            direccion_completo: `Recojo en ${formData.agencia_recojo} - ${formData.direccion_agencia}`,
        };

        try {
            if (editingId) {
                // Actualizar dirección existente
                await apiClient.put(`/direcciones/${editingId}/`, payload);
            } else {
                // Crear nueva dirección
                await apiClient.post('/direcciones/', payload);
            }
            resetForm();
            fetchAddresses(); // Recargar la lista de direcciones
        } catch (err) {
            setError('Hubo un error al guardar la dirección.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
            setLoading(true);
            try {
                await apiClient.delete(`/direcciones/${id}/`);
                fetchAddresses();
            } catch (err) {
                setError('No se pudo eliminar la dirección.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    return (
        <Card>
            <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                Mis Direcciones de Recojo
                {!showForm && (
                    <Button variant="success" size="sm" onClick={() => setShowForm(true)}>
                        <FaPlus className="me-2" /> Añadir Nueva
                    </Button>
                )}
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* FORMULARIO PARA AÑADIR/EDITAR (se muestra condicionalmente) */}
                {showForm && (
                    <Form onSubmit={handleSubmit} className="mb-5 p-4 border rounded bg-light">
                        <h6 className="mb-3">{editingId ? 'Editar Dirección' : 'Nueva Dirección de Recojo'}</h6>
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Nombres*</Form.Label><Form.Control type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} required /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellidos*</Form.Label><Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>DNI*</Form.Label><Form.Control type="text" name="dni" value={formData.dni} onChange={handleInputChange} required maxLength="8" /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Teléfono*</Form.Label><Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required maxLength="9" /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Agencia de Recojo*</Form.Label><Form.Control type="text" name="agencia_recojo" placeholder="Ej: Shalom, Olva" value={formData.agencia_recojo} onChange={handleInputChange} required /></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Dirección de la Agencia*</Form.Label><Form.Control type="text" name="direccion_agencia" placeholder="Ej: Av. Principal 123, Miraflores" value={formData.direccion_agencia} onChange={handleInputChange} required /></Form.Group></Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
                            <Button type="submit" variant="primary">Guardar Dirección</Button>
                        </div>
                    </Form>
                )}

                {/* LISTA DE DIRECCIONES GUARDADAS */}
                {!showForm && (
                    <Row>
                        {addresses.map(addr => (
                            <Col md={6} key={addr.id} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        {addr.es_principal && <Badge bg="success" className="mb-2">Principal</Badge>}
                                        <Card.Title>{addr.nombres} {addr.apellidos}</Card.Title>
                                        <Card.Text>
                                            <strong>DNI:</strong> {addr.dni}<br />
                                            <strong>Teléfono:</strong> {addr.telefono}<br />
                                            <hr />
                                            <strong>Agencia:</strong> {addr.agencia_recojo}<br />
                                            <strong>Dirección:</strong> {addr.direccion_agencia}
                                        </Card.Text>
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(addr.id)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        {addresses.length === 0 && !loading && (
                            <Col className="text-center text-muted">No tienes ninguna dirección guardada.</Col>
                        )}
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
};

export default AddressManagement;