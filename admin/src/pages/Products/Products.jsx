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

      {/* Header */}
      <div
        className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 0%)' }}
      >
        <div className="flex items-center gap-3">
          <Package size={32} strokeWidth={2} className="text-white" />
          <div>
            <h1 className="text-2xl font-bold">Gestión de Productos</h1>
            <p className="text-sm text-white/80">Administra el catálogo de productos de tu empresa</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
          style={{ borderColor: '#92590a', color: '#92590a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#000000' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}
        >
          <Plus size={16} />
          Agregar Producto
        </button>
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
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
          setToast({
            message: 'Producto eliminado exitosamente',
            type: 'success',
          })
        }}
        onCancel={cancelDelete}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Products