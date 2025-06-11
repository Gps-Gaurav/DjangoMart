import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CartScreen from "./screens/CartScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import WaitingScreen from "./screens/WaitingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AllProductsScreen from "./screens/AllProductsScreen";
import OrderScreen from "./screens/OrderScreen";
import GitHubCallbackScreen from "./screens/GitHubCallbackScreen";

function App() {
    return (
        <div className="d-flex flex-column site-container">
            <Header />
            <main className="main-content py-3">
                <Container>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/signup" element={<SignupScreen />} />
                        <Route path="/github-callback" element={<GitHubCallbackScreen />} />
                        <Route path="/verify-email" element={<WaitingScreen />} />
                        <Route path="/activate/:uid/:token" element={<WaitingScreen />} />
                        <Route path="/product/:id" element={<ProductScreen />} />
                        <Route path="/products" element={<AllProductsScreen />} />
                        <Route path="/cart" element={<CartScreen />} />

                        {/* Protected Routes */}
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/orders" element={<OrderScreen />} />

                        {/* Fallback */}
                        <Route path="*" element={<NotFoundScreen />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

export default App;
