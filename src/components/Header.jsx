import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="nav">
        <Link to="/" className="logo" onClick={closeMenu}>
          Global-GS Store
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={menuOpen ? "menu open" : "menu"}>
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>

          <Link to="/productos" onClick={closeMenu}>
            Productos
          </Link>

          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          {!token && (
            <Link to="/login" onClick={closeMenu}>
              Iniciar sesión
            </Link>
          )}

          {token && (
  <>
    <Link
      to="/admin"
      className="admin-link"
      onClick={closeMenu}
    >
      Administración
    </Link>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
    >
      Cerrar sesión
    </button>
  </>
)}

export default Header;