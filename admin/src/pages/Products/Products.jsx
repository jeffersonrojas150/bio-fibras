// src/pages/Products/Products.jsx
import { useState } from 'react'
import { Plus, Package } from 'lucide-react'
import ProductFilters from '../../components/Products/ProductFilters'
import ProductTable from '../../components/Products/ProductTable'
import ProductFormModal from '../../components/Products/ProductFormModal'
import ProductDeleteConfirm from '../../components/Products/ProductDeleteConfirm'
import Toast from '../../components/UI/Toast'
import { useProducts } from './hooks/useProducts'

function Products() {
  const {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages, getPageNumbers,
    fetchProducts,
    modalOpen, selectedProduct, openCreate, openEdit, closeModal, onSaveSuccess,
    deleteTarget, confirmDelete, cancelDelete, executeDelete,
  } = useProducts()

  const [toast, setToast] = useState(null)

  return (
    <div className="space-y-4">

      {/* Contenedor unificado */}
      <div className="rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg,  #d7ad44 0%, #b8941a 10%)' }}
        >
          <div className="flex items-center gap-3">
            <Package size={30} strokeWidth={2} className="text-white/90" />
            <div>
              <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Gestión de Productos
              </h1>
              <p className="text-sm text-white/75">Administra el catálogo de productos de tu empresa</p>
            </div>
          </div>

          {/* Botón original */}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
            style={{ borderColor: '#92590a', color: '#92590a' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#4f3c04' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#92590a' }}
          >
            <Plus size={16} />
            Agregar Producto
          </button>
        </div>

        {/* Filtros + Tabla */}
        <div className="bg-white px-6 py-5 space-y-4">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            onRefresh={fetchProducts}
            count={filtered.length}
          />
          <ProductTable
            paginated={paginated}
            loading={loading}
            onEdit={openEdit}
            onDelete={confirmDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            getPageNumbers={getPageNumbers}
            setCurrentPage={setCurrentPage}
          />
        </div>

      </div>

      {/* Modal crear / editar */}
      <ProductFormModal
        isOpen={modalOpen}
        product={selectedProduct}
        onClose={closeModal}
        onSuccess={async () => {
          const wasEditing = !!selectedProduct
          await onSaveSuccess()
          setToast({
            message: wasEditing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
            type: 'success',
          })
        }}
      />

      {/* Modal eliminar */}
      <ProductDeleteConfirm
        product={deleteTarget}
        onConfirm={async () => {
          await executeDelete()
          setToast({ message: 'Producto eliminado exitosamente', type: 'success' })
        }}
        onCancel={cancelDelete}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Products