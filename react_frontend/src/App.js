import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CartScreen from "./screens/CartScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import WaitingScreen from './screens/WaitingScreen';
import ProfileScreen from "./screens/ProfileScreen";
import AllProductsScreen from "./screens/AllProductsScreen";

function App() {
    return (
        <div className="d-flex flex-column site-container">
            <Header />
            <main className="main-content">
                <Container>
                    <Routes>
                        {/* Home Route */}
                        <Route path="/" element={<HomeScreen />} />

                        <Route path="/profile" element={<ProfileScreen/>} />
                        
                        {/* Product Routes */}
                        <Route path="/product/:id" element={<ProductScreen />} />
                        <Route path="/products" element={<AllProductsScreen />} />
                        <Route path="/cart" element={<CartScreen />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/signup" element={<SignupScreen />} />
                        
                        {/* Waiting Routes */}
                        
                        <Route path="/verify-email" element={<WaitingScreen />} />
                        <Route path="/activate/:uid/:token" element={<WaitingScreen />} />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundScreen />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export default App;