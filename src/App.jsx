import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/admin";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/producto/:id" element={<ProductDetails />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;