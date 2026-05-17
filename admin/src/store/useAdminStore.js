// src/store/useAdminStore.js
import { create } from 'zustand'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getMaterials } from '../api/materials'
import { getOrders, getOrder } from '../api/orders'
import { getUsers } from '../api/users'

const POLLING_INTERVAL = 60_000 // 60 segundos

export const useAdminStore = create((set, get) => ({

  // ── Data ──────────────────────────────────────────────────────────────────
  products:   [],
  categories: [],
  materials:  [],
  orders:     [],
  users:      [],

  // ── Estado de carga inicial ───────────────────────────────────────────────
  initialized: false,
  loading:     false,
  loadError:   false,

  // ── Timers y listeners de polling ─────────────────────────────────────────
  _pollingTimerOrders:   null,
  _pollingTimerUsers:    null,
  _visibilityOrders:     null,  // referencia al listener para poder removerlo
  _visibilityUsers:      null,

  // ─────────────────────────────────────────────────────────────────────────
  // CARGA INICIAL: llama todos los endpoints en paralelo
  // ─────────────────────────────────────────────────────────────────────────
  initializeData: async () => {
    if (get().initialized || get().loading) return

    set({ loading: true, loadError: false })

    try {
      const [prodRes, catRes, matRes, ordRes, usrRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getMaterials(),
        getOrders(),
        getUsers(),
      ])

      set({
        products:    prodRes.data.results ?? prodRes.data,
        categories:  catRes.data.results  ?? catRes.data,
        materials:   matRes.data.results  ?? matRes.data,
        orders:      ordRes.data.results  ?? ordRes.data,
        users:       usrRes.data.results  ?? usrRes.data,
        initialized: true,
        loading:     false,
        loadError:   false,
      })

      // Arranca ambos pollings una vez cargada la data
      get()._startOrderPolling()
      get()._startUserPolling()

    } catch (e) {
      console.error('[AdminStore] Error en carga inicial:', e)
      set({ loading: false, loadError: true })
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POLLING DE ÓRDENES
  // - Cada 60s hace fetch si el tab está visible
  // - Al volver al tab, hace fetch inmediato solo si pasaron más de 60s
  // ─────────────────────────────────────────────────────────────────────────
  _startOrderPolling: () => {
    const existing = get()._pollingTimerOrders
    if (existing) clearInterval(existing)

    // Remueve listener anterior si existía
    const prevListener = get()._visibilityOrders
    if (prevListener) document.removeEventListener('visibilitychange', prevListener)

    let lastFetch = Date.now()

    async function fetchNewOrders() {
      try {
        const res        = await getOrders()
        const latest     = res.data.results ?? res.data
        const currentIds = new Set(get().orders.map(o => o.id))
        const newOrders  = latest.filter(o => !currentIds.has(o.id))
        if (newOrders.length > 0) {
          console.log(`[AdminStore] ${newOrders.length} nueva(s) orden(es) detectada(s)`)
          set(state => ({ orders: [...newOrders, ...state.orders] }))
        }
        lastFetch = Date.now()
      } catch (e) {
        console.error('[AdminStore] Error en polling de órdenes:', e)
      }
    }

    // Listener visibilitychange: fetch inmediato si vuelve después de 60s
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetch >= POLLING_INTERVAL) {
        fetchNewOrders()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    // Tick normal cada 60s (solo si tab visible)
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      fetchNewOrders()
    }, POLLING_INTERVAL)

    set({ _pollingTimerOrders: timer, _visibilityOrders: onVisible })
  },

  stopOrderPolling: () => {
    const timer    = get()._pollingTimerOrders
    const listener = get()._visibilityOrders
    if (timer)    clearInterval(timer)
    if (listener) document.removeEventListener('visibilitychange', listener)
    set({ _pollingTimerOrders: null, _visibilityOrders: null })
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POLLING DE USUARIOS
  // - Cada 60s hace fetch si el tab está visible
  // - Al volver al tab, hace fetch inmediato solo si pasaron más de 60s
  // ─────────────────────────────────────────────────────────────────────────
  _startUserPolling: () => {
    const existing = get()._pollingTimerUsers
    if (existing) clearInterval(existing)

    const prevListener = get()._visibilityUsers
    if (prevListener) document.removeEventListener('visibilitychange', prevListener)

    let lastFetch = Date.now()

    async function fetchNewUsers() {
      try {
        const res        = await getUsers()
        const latest     = res.data.results ?? res.data
        const currentIds = new Set(get().users.map(u => u.id))
        const newUsers   = latest.filter(u => !currentIds.has(u.id))
        if (newUsers.length > 0) {
          console.log(`[AdminStore] ${newUsers.length} nuevo(s) usuario(s) detectado(s)`)
          set(state => ({ users: [...newUsers, ...state.users] }))
        }
        lastFetch = Date.now()
      } catch (e) {
        console.error('[AdminStore] Error en polling de usuarios:', e)
      }
    }

    // Listener visibilitychange: fetch inmediato si vuelve después de 60s
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetch >= POLLING_INTERVAL) {
        fetchNewUsers()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    // Tick normal cada 60s (solo si tab visible)
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      fetchNewUsers()
    }, POLLING_INTERVAL)

    set({ _pollingTimerUsers: timer, _visibilityUsers: onVisible })
  },

  stopUserPolling: () => {
    const timer    = get()._pollingTimerUsers
    const listener = get()._visibilityUsers
    if (timer)    clearInterval(timer)
    if (listener) document.removeEventListener('visibilitychange', listener)
    set({ _pollingTimerUsers: null, _visibilityUsers: null })
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RESET: limpia todo el store (en logout)
  // ─────────────────────────────────────────────────────────────────────────
  reset: () => {
    get().stopOrderPolling()
    get().stopUserPolling()
    set({
      products:    [],
      categories:  [],
      materials:   [],
      orders:      [],
      users:       [],
      initialized: false,
      loading:     false,
      loadError:   false,
    })
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACTUALIZACIONES LOCALES — PRODUCTOS
  // ─────────────────────────────────────────────────────────────────────────
  addProduct: (product) =>
    set(state => ({ products: [product, ...state.products] })),

  updateProduct: (updated) =>
    set(state => ({
      products: state.products.map(p => p.id === updated.id ? updated : p),
    })),

  removeProduct: (id) =>
    set(state => ({ products: state.products.filter(p => p.id !== id) })),

  refetchProducts: async () => {
    try {
      const res = await getProducts()
      set({ products: res.data.results ?? res.data })
    } catch (e) {
      console.error('[AdminStore] Error al refetch productos:', e)
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACTUALIZACIONES LOCALES — CATEGORÍAS
  // ─────────────────────────────────────────────────────────────────────────
  addCategory: (category) =>
    set(state => ({ categories: [category, ...state.categories] })),

  updateCategory: (updated) =>
    set(state => ({
      categories: state.categories.map(c => c.id === updated.id ? updated : c),
    })),

  removeCategory: (id) =>
    set(state => ({ categories: state.categories.filter(c => c.id !== id) })),

  refetchCategories: async () => {
    try {
      const res = await getCategories()
      set({ categories: res.data.results ?? res.data })
    } catch (e) {
      console.error('[AdminStore] Error al refetch categorías:', e)
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACTUALIZACIONES LOCALES — MATERIALES
  // ─────────────────────────────────────────────────────────────────────────
  addMaterial: (material) =>
    set(state => ({ materials: [material, ...state.materials] })),

  updateMaterial: (updated) =>
    set(state => ({
      materials: state.materials.map(m => m.id === updated.id ? updated : m),
    })),

  removeMaterial: (id) =>
    set(state => ({ materials: state.materials.filter(m => m.id !== id) })),

  refetchMaterials: async () => {
    try {
      const res = await getMaterials()
      set({ materials: res.data.results ?? res.data })
    } catch (e) {
      console.error('[AdminStore] Error al refetch materiales:', e)
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACTUALIZACIONES LOCALES — ÓRDENES
  // ─────────────────────────────────────────────────────────────────────────
  updateOrder: (updated) =>
    set(state => ({
      orders: state.orders.map(o => o.id === updated.id ? updated : o),
    })),

  refetchOrder: async (id) => {
    try {
      const res = await getOrder(id)
      get().updateOrder(res.data)
    } catch (e) {
      console.error('[AdminStore] Error al refetch orden:', e)
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACTUALIZACIONES LOCALES — USUARIOS
  // ─────────────────────────────────────────────────────────────────────────
  refetchUsers: async () => {
    try {
      const res = await getUsers()
      set({ users: res.data.results ?? res.data })
    } catch (e) {
      console.error('[AdminStore] Error al refetch usuarios:', e)
    }
  },
}))