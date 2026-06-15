import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from '@vercel/analytics/react';


import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Categories from "./pages/Categories/Categories";
import Contact from "./pages/Contact/Contact";
import { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from "./components/auth";


import Header from "./components/common/Layout/Header";
import Footer from "./components/common/Layout/Footer";

import { useAuth } from "./context/authContext";

import { CartProvider } from "./context/cartContext";
import { OrdersProvider } from "./context/ordersContext";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import OrderConfirmation from "./pages/Orders/OrderConfirmation";
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentFailure from './pages/Payment/PaymentFailure';
import PaymentPending from './pages/Payment/PaymentPending';
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

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID


const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};


  function App() {
  return (
    <div className="App">
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <CategoryProvider>
            <ProductProvider>
              <FavoritesProvider>
                <CartProvider>
                  <OrderProvider>
                    <OrdersProvider>
                      <Router>
                        <ScrollToTop />
                        <Header />
                        <main id="page-content">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/productos" element={<Products />} />
                            <Route path="/producto/:slug" element={<ProductDetail />} />
                            <Route path="/categorias" element={<Categories />} />
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
                            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                            <Route
                              path="/order-confirmation"
                              element={<OrderConfirmation />}
                            />
                            {/* ← AGREGAR ESTAS 3 RUTAS AQUÍ */}
                            <Route path="/pago/success" element={<PaymentSuccess />} />
                            <Route path="/pago/failure" element={<PaymentFailure />} />
                            <Route path="/pago/pending" element={<PaymentPending />} />
                            {/* Rutas Legales */}
                            <Route path="/terminos-y-condiciones" element={<TermsConditions />} />
                            <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />

                            <Route path="/mis-ordenes" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
                            <Route path="/ordenes/:orderId" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
                            <Route path="/favoritos" element={<PrivateRoute><Favorites /></PrivateRoute>} />
                            <Route path="/about" element={<About />} />
                            <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>}>
                              <Route index element={<Navigate to="datos" replace />} />
                              <Route path="datos" element={<PersonalData />} />
                              <Route path="direcciones" element={<AddressManagement />} />
                            </Route>
                          </Routes>
                        </main>

                        <Footer />
                        <Cart />
                        <Toaster position="top-center" reverseOrder={false} />
                      </Router>
                    </OrdersProvider>
                  </OrderProvider>
                </CartProvider>
              </FavoritesProvider>
            </ProductProvider>
          </CategoryProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
      <Analytics />
    </div>
  );
}

export default App;
