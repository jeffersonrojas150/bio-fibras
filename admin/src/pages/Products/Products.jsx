import { Plus } from 'lucide-react'
import ProductFilters from '../../components/products/ProductFilters'
import ProductTable from '../../components/products/ProductTable'
import ProductFormModal from '../../components/products/ProductFormModal'
import ProductDeleteConfirm from '../../components/products/ProductDeleteConfirm'
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

  return (
    <div className="space-y-4">

      {/* Header */}
      <div
        className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ backgroundColor: '#b8860b' }}
      >
        <div>
          <h1 className="text-xl font-bold">Gestión de Productos</h1>
          <p className="text-sm text-white/80">Administra el catálogo de productos de tu empresa</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
          style={{ borderColor: '#92590a', color: '#92590a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
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

      {/* Modales */}
      <ProductFormModal
        isOpen={modalOpen}
        product={selectedProduct}
        onClose={closeModal}
        onSuccess={onSaveSuccess}
      />
      <ProductDeleteConfirm
        product={deleteTarget}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default Products