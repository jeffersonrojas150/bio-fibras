import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// Importar páginas
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Categories from './pages/Categories/Categories';
import { LoginForm, RegisterForm, ForgotPasswordForm } from './components/auth';

import Header from './components/common/Layout/Header';
import Footer from './components/common/Layout/Footer';

import { CartProvider } from './context/cartContext';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderConfirmation from './pages/Orders/OrderConfirmation';
import { OrderProvider } from './context/orderContext';
import { AuthProvider } from './context/authContext'; 
import MyOrders from './pages/Orders/MyOrders'; 
import { FavoritesProvider } from './context/favoritesContext';
import './App.css';

function App() {
  return (
    <div className="App">
      {/*  Envolver todo con AuthProvider */}
      <AuthProvider>
        <FavoritesProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              {/* Header fuera de las rutas */}
              <Header />
                         
              {/* Contenido principal */}
              <main id="page-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/producto/:slug" element={<ProductDetail />} />
                  <Route path="/categorias" element={<Categories />} />
                  <Route path="/productos/categoria/:slug" element={<Products />} />
                                 
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/registro" element={<RegisterForm />} />
                  <Route path="/recuperar-password" element={<ForgotPasswordForm />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  
                  
                  <Route path="/mis-ordenes" element={<MyOrders />} />
                                 
                  {/* Rutas adicionales que puedes implementar */}
                  {/* <Route path="/nosotros" element={<About />} /> */}
                  {/* <Route path="/contacto" element={<Contact />} /> */}
                  {/* <Route path="/terminos" element={<Terms />} /> */}
                  {/* <Route path="/privacidad" element={<Privacy />} /> */}
                  {/* <Route path="/mi-perfil" element={<MyProfile />} /> */}
                  {/* <Route path="/favoritos" element={<Favorites />} /> */}
                                 
                  {/* Ruta 404 - Página no encontrada */}
                  {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
              </main>
                         
              {/* Footer fuera del main, después de las rutas */}
              <Footer />
                         
              <Cart />
            </Router>
          </OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
    </div>
  );
}

export default App;