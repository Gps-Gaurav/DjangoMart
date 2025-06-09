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

function App() {
    return (
        <div className="d-flex flex-column site-container">
            <Header />
            <main className="main-content">
                <Container>
                    <Routes>
                        {/* Home Route */}
                        <Route path="/" element={<HomeScreen />} />
                        
                        {/* Product Routes */}
                        <Route path="/product/:id" element={<ProductScreen />} />
                        <Route path="/cart" element={<CartScreen />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/signup" element={<SignupScreen />} />
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