import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaPlus, FaTrash, FaMapMarkedAlt } from 'react-icons/fa';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import apiClient from '../../api';
import MapaPicker from '../../components/MapaPicker/MapaPicker';

const libraries = ['places'];

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    const [coords, setCoords] = useState({ latitud: null, longitud: null });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
    const [mapZoom, setMapZoom] = useState(12);
    const autocompleteRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

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
        setCoords({ latitud: null, longitud: null });
        setMarkerPosition(null);
        setMapCenter({ lat: -12.0464, lng: -77.0428 });
        setMapZoom(12);
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

    // Cuando selecciona sugerencia de Google en el campo dirección
    const handlePlaceChanged = useCallback(() => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };

        setFormData(prev => ({
            ...prev,
            direccion_agencia: place.formatted_address || place.name || prev.direccion_agencia,
        }));

        setMarkerPosition(newPos);
        setMapCenter(newPos);
        setMapZoom(17);
        setCoords({ latitud: lat, longitud: lng });
    }, []);

    // Click en el mapa
    const handleMapClick = useCallback((e) => {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPosition(newPos);
        setCoords({ latitud: newPos.lat, longitud: newPos.lng });
    }, []);

    // Drag del marker
    const handleMarkerDragEnd = useCallback((e) => {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarkerPosition(newPos);
        setCoords({ latitud: newPos.lat, longitud: newPos.lng });
    }, []);

    // Abrir formulario para editar — precarga datos incluyendo coords
    const handleEdit = (addr) => {
        setFormData({
            nombres: addr.nombres,
            apellidos: addr.apellidos,
            dni: addr.dni,
            telefono: addr.telefono,
            agencia_recojo: addr.agencia_recojo,
            direccion_agencia: addr.direccion_agencia,
            departamento: addr.departamento || 'Lima',
            provincia: addr.provincia || 'Lima',
            distrito: addr.distrito || 'Recojo en Agencia',
            direccion_completo: addr.direccion_completo || '',
            es_principal: addr.es_principal,
        });

        // Si la dirección ya tiene coordenadas, mostrar el pin
        if (addr.latitud && addr.longitud) {
            const pos = {
                lat: parseFloat(addr.latitud),
                lng: parseFloat(addr.longitud),
            };
            setMarkerPosition(pos);
            setMapCenter(pos);
            setMapZoom(17);
            setCoords({ latitud: addr.latitud, longitud: addr.longitud });
        } else {
            setMarkerPosition(null);
            setMapCenter({ lat: -12.0464, lng: -77.0428 });
            setMapZoom(12);
            setCoords({ latitud: null, longitud: null });
        }

        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...formData,
            direccion_completo: `Recojo en ${formData.agencia_recojo} - ${formData.direccion_agencia}`,
            latitud: coords.latitud,
            longitud: coords.longitud,
        };

        try {
            if (editingId) {
                await apiClient.put(`/direcciones/${editingId}/`, payload);
            } else {
                await apiClient.post('/direcciones/', payload);
            }
            resetForm();
            fetchAddresses();
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

    if (loading && !showForm) {
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

                {/* FORMULARIO AÑADIR/EDITAR */}
                {showForm && (
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <h6 className="mb-3">
                            {editingId ? 'Editar Dirección' : 'Nueva Dirección de Recojo'}
                        </h6>

                        <Alert variant="info" className="mb-3" style={{ fontSize: '0.9rem' }}>
                            <FaMapMarkedAlt className="me-2" />
                            Escribe la dirección de la agencia y selecciona la sugerencia correcta para ubicarla en el mapa.
                        </Alert>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombres *</Form.Label>
                                    <Form.Control type="text" name="nombres" value={formData.nombres} onChange={handleInputChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellidos *</Form.Label>
                                    <Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>DNI *</Form.Label>
                                    <Form.Control type="text" name="dni" value={formData.dni} onChange={handleInputChange} required maxLength="8" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono *</Form.Label>
                                    <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required maxLength="9" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de la Agencia *</Form.Label>
                                    <Form.Control type="text" name="agencia_recojo" placeholder="Ej: Shalom, Olva" value={formData.agencia_recojo} onChange={handleInputChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dirección de la Agencia *</Form.Label>
                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={(ref) => (autocompleteRef.current = ref)}
                                            onPlaceChanged={handlePlaceChanged}
                                            options={{ componentRestrictions: { country: 'pe' } }}
                                        >
                                            <Form.Control
                                                type="text"
                                                name="direccion_agencia"
                                                placeholder="Busca la dirección de la agencia..."
                                                value={formData.direccion_agencia}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Autocomplete>
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            name="direccion_agencia"
                                            placeholder="Busca la dirección de la agencia..."
                                            value={formData.direccion_agencia}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Mapa */}
                        <MapaPicker
                            markerPosition={markerPosition}
                            mapCenter={mapCenter}
                            mapZoom={mapZoom}
                            onMapClick={handleMapClick}
                            onMarkerDragEnd={handleMarkerDragEnd}
                        />

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
                            <Button type="submit" variant="success" disabled={loading}>
                                {loading ? <Spinner as="span" size="sm" className="me-2" /> : null}
                                Guardar Dirección
                            </Button>
                        </div>
                    </Form>
                )}

                {/* LISTA DE DIRECCIONES */}
                {!showForm && (
                    <Row>
                        {addresses.map(addr => (
                            <Col md={6} key={addr.id} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        {addr.es_principal && <Badge bg="success" className="mb-2">Principal</Badge>}
                                        <Card.Title>{addr.nombres} {addr.apellidos}</Card.Title>
                                        <Card.Text as="div">
                                            <strong>DNI:</strong> {addr.dni}<br />
                                            <strong>Teléfono:</strong> {addr.telefono}<br />
                                            <hr />
                                            <strong>Agencia:</strong> {addr.agencia_recojo}<br />
                                            <strong>Dirección:</strong> {addr.direccion_agencia}<br />
                                            {addr.latitud && addr.longitud && (
                                                <small className="text-success">
                                                    📍 Ubicación guardada en el mapa
                                                </small>
                                            )}
                                        </Card.Text>
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(addr)}>
                                                <FaMapMarkedAlt />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(addr.id)}>
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        {addresses.length === 0 && (
                            <Col className="text-center text-muted">
                                No tienes ninguna dirección guardada.
                            </Col>
                        )}
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
};

export default AddressManagement;