import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./components/screens/HomeScreen";
import ProductScreen from "./components/screens/ProductScreen";
import LoginScreen from "./components/screens/LoginScreen";
import SignupScreen from "./components/screens/SignupScreen";
import CartScreen from "./components/screens/CartScreen";
import NotFoundScreen from "./components/screens/NotFoundScreen";

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<HomeScreen />} exact />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;