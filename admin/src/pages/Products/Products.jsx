// src/pages/Products/Products.jsx
import { useState } from 'react'
import { Plus, Package } from 'lucide-react'
import ProductFilters from '../../components/Products/ProductFilters'
import ProductTable from '../../components/Products/ProductTable'
import ProductCard from '../../components/Products/ProductCard'
import ProductFormModal from '../../components/Products/ProductFormModal'
import ProductDeleteConfirm from '../../components/Products/ProductDeleteConfirm'
import Toast from '../../components/UI/Toast'
import { useProducts } from './hooks/useProducts'

// ── Paginación ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  const activeStyle      = { backgroundColor: '#166534', color: 'white', border: 'none' }
  const inactiveStyle    = { backgroundColor: 'white', color: '#555', border: '1px solid #e0e0e0' }
  const navEnabledStyle  = { color: '#166534', borderColor: '#166534', backgroundColor: 'white' }
  const navDisabledStyle = { color: '#ccc', borderColor: '#e0e0e0', backgroundColor: 'white' }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === 1 ? navDisabledStyle : navEnabledStyle}
      >
        Anterior
      </button>
      {getPageNumbers().map(n => (
        <button key={n} onClick={() => setCurrentPage(n)}
          className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
          style={n === currentPage ? activeStyle : inactiveStyle}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === totalPages ? navDisabledStyle : navEnabledStyle}
      >
        Siguiente
      </button>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
function Products() {
  const {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    getPageNumbers, getPageNumbersMobile,
    fetchProducts,
    modalOpen, selectedProduct, openCreate, openEdit, closeModal, onSaveSuccess,
    deleteTarget, confirmDelete, cancelDelete, executeDelete,
    deleting,
  } = useProducts()

  const [toast, setToast] = useState(null)

  return (
    <div className="space-y-4" style={{ fontFamily: 'Raleway, sans-serif' }}>

      <div className="rounded-2xl shadow-md overflow-hidden">

        {/* ── Header ── */}
        <div
          className="px-6 py-5 text-white"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
        >
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={28} strokeWidth={2} className="text-white/90" />
              <div>
                <h1 className="text-xl font-bold tracking-wide">Gestión de Productos</h1>
                <p className="text-sm text-white/75">Administra el catálogo de productos de tu empresa</p>
              </div>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
              style={{ borderColor: '#92590a', color: '#92590a' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4f3c04' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#92590a' }}
            >
              <Plus size={16} /> Agregar Producto
            </button>
          </div>

          {/* Móvil */}
          <div className="md:hidden">
            <div className="flex items-start gap-3 mb-3">
              <Package size={22} strokeWidth={2} className="text-white/90 shrink-0 mt-0.5" />
              <div>
                <h1 className="text-lg font-bold tracking-wide leading-tight">Gestión de Productos</h1>
                <p className="text-xs text-white/75 mt-0.5">Administra el catálogo de productos de tu empresa</p>
              </div>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
              style={{ borderColor: '#92590a', color: '#92590a' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#4f3c04' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#92590a' }}
            >
              <Plus size={16} /> Agregar Producto
            </button>
          </div>
        </div>

        {/* ── Filtros + Contenido ── */}
        <div className="bg-white px-4 md:px-6 py-5 space-y-4">

          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            onRefresh={fetchProducts}
            count={filtered.length}
          />

          {/* Vista MÓVIL: cards + paginación de 3 */}
          <div className="md:hidden space-y-3">
            {loading ? (
              <p className="text-center py-10 text-gray-400 text-sm">Cargando...</p>
            ) : paginated.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">No se encontraron productos</p>
            ) : (
              <>
                {paginated.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onEdit={openEdit}
                    onDelete={confirmDelete}
                  />
                ))}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    getPageNumbers={getPageNumbersMobile}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>

          {/* Vista DESKTOP: tabla + paginación  */}
          <div className="hidden md:block">
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
      </div>

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

      <ProductDeleteConfirm
        product={deleteTarget}
        deleting={deleting}
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