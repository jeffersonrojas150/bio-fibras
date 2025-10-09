import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Importar páginas
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Categories from "./pages/Categories/Categories";
import Contact from "./pages/Contact/Contact";
import { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from "./components/auth";

import Header from "./components/common/Layout/Header";
import Footer from "./components/common/Layout/Footer";

import { CartProvider } from "./context/cartContext";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import OrderConfirmation from "./pages/Orders/OrderConfirmation";
import { OrderProvider } from "./context/orderContext";
import { AuthProvider } from "./context/authContext";
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetail from "./pages/Orders/OrderDetail";
import { FavoritesProvider } from "./context/favoritesContext";
import { ProductProvider } from "./context/productContext";
import { CategoryProvider } from "./context/categoryContext";
import Favorites from "./pages/Favorites/Favorites";
import About from './pages/About/About';
import ProfilePage from './pages/Profile/ProfilePage';
import AddressManagement from './pages/Profile/AddressManagement';
import PersonalData from './pages/Profile/PersonalData';
import TermsConditions from './pages/Legal/TermsConditions';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "react-hot-toast";



import "./App.css";

const GOOGLE_CLIENT_ID =
  "876707612320-et00ma5g32t9a4op91mp4ajobbgrukeg.apps.googleusercontent.com";

function App() {
  return (
    <div className="App">
      {/* AuthProvider maneja login, tokens y refresh */}
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CategoryProvider>
            <ProductProvider>
              <FavoritesProvider>
                <CartProvider>
                  <OrderProvider>
                    <Router>
                      <ScrollToTop  />
                      <Header />

                      <main id="page-content">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/productos" element={<Products />} />
                          <Route path="/producto/:slug" element={<ProductDetail />} />
                          <Route path="/categorias" element={<Categories />} />


                          {/* Ruta para la página de productos con un filtro de categoría */}
                          <Route path="/productos/categoria/:categorySlug" element={<Products />} />
                          <Route path="/contacto" element={<Contact />} />

                          <Route path="/login" element={<LoginForm />} />
                          <Route path="/registro" element={<RegisterForm />} />
                          <Route
                            path="/recuperar-password"
                            element={<ForgotPasswordForm />}
                          />
                          <Route
                            path="/reset-password/:uid/:token"
                            element={<ResetPasswordForm />}
                          />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route
                            path="/order-confirmation"
                            element={<OrderConfirmation />}
                          />
                              {/* Rutas Legales */}
                          <Route path="/terminos-y-condiciones" element={<TermsConditions />} />
                          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />

                          <Route path="/mis-ordenes" element={<MyOrders />} />
                          <Route path="/ordenes/:orderId" element={<OrderDetail />} />
                          <Route path="/favoritos" element={<Favorites />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/perfil" element={<ProfilePage />}>
                            <Route index element={<Navigate to="datos" replace />} />
                            <Route path="datos" element={<PersonalData />} />
                            <Route path="direcciones" element={<AddressManagement />} />

                        
                          </Route>

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
                       <Toaster position="top-center" reverseOrder={false} />
                    </Router>
                  </OrderProvider>
                </CartProvider>
              </FavoritesProvider>
            </ProductProvider>
          </CategoryProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
