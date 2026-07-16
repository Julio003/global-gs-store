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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import DataDeletion from "./pages/DataDeletion";
import AssistantWidget from "./components/AssistantWidget";
import InstallAppPrompt from "./components/InstallAppPrompt";
import OfflineNotice from "./components/OfflineNotice";

function App() {
  return (
    <>
      <OfflineNotice />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/producto/:id" element={<ProductDetails />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos-condiciones" element={<TermsConditions />} />
        <Route path="/eliminacion-datos" element={<DataDeletion />} />
      </Routes>

      <Footer />
      <AssistantWidget />
      <InstallAppPrompt />
    </>
  );
}

export default App;
