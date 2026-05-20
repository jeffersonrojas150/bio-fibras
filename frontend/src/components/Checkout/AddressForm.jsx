import React, { useState, useRef, useCallback } from 'react';
import { Form, Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaShippingFast, FaUser, FaBuilding, FaMapMarkedAlt } from 'react-icons/fa';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import apiClient from '../../api';
import MapaPicker from '../MapaPicker/MapaPicker';

const libraries = ['places'];

const AddressForm = ({ onAddressCreated }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        agencia_recojo: '',
        direccion_agencia: '',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'N/A',
        direccion_completo: 'Recojo en Agencia',
    });

    const [coords, setCoords] = useState({ latitud: null, longitud: null });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
    const [mapZoom, setMapZoom] = useState(12);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const autocompleteRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombres.trim()) newErrors.nombres = 'El nombre es requerido.';
        if (!formData.apellidos.trim()) newErrors.apellidos = 'El apellido es requerido.';
        if (!/^\d{8}$/.test(formData.dni)) newErrors.dni = 'El DNI debe tener 8 dígitos.';
        if (!/^\d{9}$/.test(formData.telefono)) newErrors.telefono = 'El teléfono debe tener 9 dígitos.';
        if (!formData.agencia_recojo.trim()) newErrors.agencia_recojo = 'El nombre de la agencia es requerido.';
        if (!formData.direccion_agencia.trim()) newErrors.direccion_agencia = 'La dirección de la agencia es requerida.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Cuando el usuario selecciona una sugerencia de Google
    const handlePlaceChanged = useCallback(() => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };

        // Actualizar el campo de texto con el nombre del lugar
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            const payload = {
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                dni: formData.dni,
                telefono: formData.telefono,
                agencia_recojo: formData.agencia_recojo,
                direccion_agencia: formData.direccion_agencia,
                departamento: 'Lima',
                provincia: 'Lima',
                distrito: 'Recojo en Agencia',
                direccion_completo: `Recojo en ${formData.agencia_recojo} - ${formData.direccion_agencia}`,
                latitud: coords.latitud,
                longitud: coords.longitud,
            };

            const response = await apiClient.post('/direcciones/', payload);
            onAddressCreated(response.data.id);
        } catch (err) {
            console.error("Error al crear la dirección:", err.response?.data || err);
            setApiError("No se pudo guardar la dirección. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="checkout-form-card">
            <Card.Header as="h5">
                <FaShippingFast className="me-2" />
                1. Completa los Datos para el Recojo
            </Card.Header>
            <Card.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    {apiError && <Alert variant="danger">{apiError}</Alert>}

                    <h6 className="mb-3"><FaUser className="me-2" />Datos de quien recoge:</h6>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombres *</Form.Label>
                                <Form.Control type="text" name="nombres" value={formData.nombres} onChange={handleChange} isInvalid={!!errors.nombres} />
                                <Form.Control.Feedback type="invalid">{errors.nombres}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos *</Form.Label>
                                <Form.Control type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} isInvalid={!!errors.apellidos} />
                                <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>DNI *</Form.Label>
                                <Form.Control type="text" name="dni" value={formData.dni} onChange={handleChange} isInvalid={!!errors.dni} maxLength="8" />
                                <Form.Control.Feedback type="invalid">{errors.dni}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono *</Form.Label>
                                <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleChange} isInvalid={!!errors.telefono} maxLength="9" />
                                <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <h6 className="mb-3"><FaBuilding className="me-2" />Agencia de Recojo:</h6>
                    <Alert variant="info" className="mb-3">
                        <FaMapMarkedAlt className="me-2" />
                        Escribe el nombre de tu agencia en el campo de dirección y selecciona la sugerencia correcta para ubicarla en el mapa.
                    </Alert>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre de la Agencia *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="agencia_recojo"
                                    placeholder="Ej: Shalom"
                                    value={formData.agencia_recojo}
                                    onChange={handleChange}
                                    isInvalid={!!errors.agencia_recojo}
                                />
                                <Form.Control.Feedback type="invalid">{errors.agencia_recojo}</Form.Control.Feedback>
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
                                            onChange={handleChange}
                                            isInvalid={!!errors.direccion_agencia}
                                        />
                                    </Autocomplete>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        name="direccion_agencia"
                                        placeholder="Busca la dirección de la agencia..."
                                        value={formData.direccion_agencia}
                                        onChange={handleChange}
                                        isInvalid={!!errors.direccion_agencia}
                                    />
                                )}
                                <Form.Control.Feedback type="invalid">{errors.direccion_agencia}</Form.Control.Feedback>
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

                    <div className="text-end mt-4">
                        <Button type="submit" className="btn-fiofibras" disabled={isLoading}>
                            {isLoading ? <Spinner as="span" size="sm" className="me-2" /> : null}
                            Guardar y Continuar
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddressForm;