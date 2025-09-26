
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// Importar páginas
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Categories from './pages/Categories/Categories';
import { LoginForm, RegisterForm, ForgotPasswordForm } from './components/auth';


import Header from './components/common/Layout/Header'; 
import { CartProvider } from './context/cartContext';
import Cart from './components/Cart/Cart';


import './App.css';

function App() {
  return (
    <div className="App">
      <CartProvider>
      <Router>
        {/* 👇 2. RENDERIZA EL HEADER FUERA DE LAS RUTAS */}
        <Header />
        
        {/* 👇 3. ENVUELVE TUS RUTAS EN EL CONTENEDOR <main> QUE SE MOVERÁ */}
        <main id="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/categorias" element={<Categories />} /> 
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />
            <Route path="/recuperar-password" element={<ForgotPasswordForm />} />
            {/* Rutas futuras que puedes implementar */}
          {/* <Route path="/categorias" element={<Categories />} /> */}
          {/* <Route path="/categoria/:categoryName" element={<CategoryProducts />} /> */}
            
          {/* <Route path="/sobre-nosotros" element={<About />} /> */}
          {/* <Route path="/contacto" element={<Contact />} /> */}
          {/* <Route path="/carrito" element={<Cart />} /> */}
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          {/* <Route path="/mi-cuenta" element={<Account />} /> */} 
          
          {/* Ruta 404 - Página no encontrada */}
          {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
        
        {/* Si tuvieras un Footer, iría aquí, fuera del <main> */}
        {/* <Footer /> */}
        <Cart />
      </Router>
      </CartProvider>
    </div>
  );
}

export default App;
