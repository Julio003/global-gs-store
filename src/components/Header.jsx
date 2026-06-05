import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenu();
    window.location.href = "/";
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
          aria-label="Abrir menÃº"
        >
          â˜°
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
              Iniciar sesiÃ³n
            </Link>
          )}

          {token && (
            <>
              <Link to="/admin" className="admin-link" onClick={closeMenu}>
                AdministraciÃ³n
              </Link>

              <button type="button" className="logout-btn" onClick={handleLogout}>
                Cerrar sesiÃ³n
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
