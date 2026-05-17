// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Products from './pages/Products/Products'
import Categories from './pages/Categories/Categories'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Users from './pages/Users/Users'
import Materials from './pages/Materials/Materials'
import OrderDetail from './pages/Orders/OrderDetail'
import InitLoader from './components/InitLoader'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <InitLoader />
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="materials" element={<Materials />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App