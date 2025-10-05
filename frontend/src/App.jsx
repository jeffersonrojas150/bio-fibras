import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Importar páginas
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Categories from "./pages/Categories/Categories";
import { LoginForm, RegisterForm, ForgotPasswordForm } from "./components/auth";

import Header from "./components/common/Layout/Header";
import Footer from "./components/common/Layout/Footer";

import { CartProvider } from "./context/cartContext";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import OrderConfirmation from "./pages/Orders/OrderConfirmation";
import { OrderProvider } from "./context/orderContext";
import { AuthProvider } from "./context/authContext";
import MyOrders from "./pages/Orders/MyOrders";
import { FavoritesProvider } from "./context/favoritesContext";
import Favorites from "./pages/Favorites/Favorites";

import "./App.css";

const GOOGLE_CLIENT_ID =
  "876707612320-et00ma5g32t9a4op91mp4ajobbgrukeg.apps.googleusercontent.com";

function App() {
  return (
    <div className="App">
      {/* AuthProvider maneja login, tokens y refresh */}
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <FavoritesProvider>
            <CartProvider>
              <OrderProvider>
                <Router>
                  <Header />

                  <main id="page-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/producto/:slug" element={<ProductDetail />} />
                      <Route path="/categorias" element={<Categories />} />
                      

                      {/* Ruta para la página de productos con un filtro de categoría */}
                      <Route path="/productos/categoria/:categorySlug" element={<Products />} />

                      <Route path="/login" element={<LoginForm />} />
                      <Route path="/registro" element={<RegisterForm />} />
                      <Route
                        path="/recuperar-password"
                        element={<ForgotPasswordForm />}
                      />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route
                        path="/order-confirmation"
                        element={<OrderConfirmation />}
                      />

                      <Route path="/mis-ordenes" element={<MyOrders />} />
                      <Route path="/favoritos" element={<Favorites />} />

                      {/* futuras rutas */}
                      {/* <Route path="/nosotros" element={<About />} /> */}
                      {/* <Route path="/contacto" element={<Contact />} /> */}
                      {/* <Route path="/terminos" element={<Terms />} /> */}
                      {/* <Route path="/privacidad" element={<Privacy />} /> */}
                      {/* <Route path="/mi-perfil" element={<MyProfile />} /> */}
                      {/* <Route path="*" element={<NotFound />} /> */}
                    </Routes>
                  </main>

                  <Footer />
                  <Cart />
                </Router>
              </OrderProvider>
            </CartProvider>
          </FavoritesProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
