// src/components/common/ConfirmDialog/ConfirmDialog.jsx
// Reemplaza window.confirm() nativo por un modal con el estilo de Biofibras,
// reutilizando react-bootstrap Modal (ya usado en ProductDetail para "Compartir").
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({
  show,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton style={{ borderBottom: '2px solid #d7ad44' }}>
      <Modal.Title className="d-flex align-items-center gap-2">
        <FaExclamationTriangle style={{ color: '#d7ad44' }} />
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDialog;
