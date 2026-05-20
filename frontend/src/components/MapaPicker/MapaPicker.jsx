import React, { useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Spinner, Alert } from 'react-bootstrap';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
};

const defaultCenter = { lat: -12.0464, lng: -77.0428 };
const libraries = ['places'];

const MapaPicker = ({ markerPosition, mapCenter, mapZoom, onMapClick, onMarkerDragEnd }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return (
      <Alert variant="danger" className="mt-2">
        Error al cargar Google Maps. Verifica tu API key.
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="d-flex align-items-center gap-2 mt-2 text-muted">
        <Spinner size="sm" animation="border" />
        <span>Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {markerPosition && (
        <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
          📍 Puedes arrastrarlo o hacer clic en otro punto para ajustar la ubicación exacta.
        </p>
      )}
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter || defaultCenter}
          zoom={mapZoom || 12}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapaPicker;