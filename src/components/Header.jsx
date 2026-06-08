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
          aria-label={"Abrir men\u00fa"}
        >
          {"\u2630"}
        </button>

        <nav className={menuOpen ? "menu open" : "menu"}>
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>

          <Link to="/productos" onClick={closeMenu}>
            Productos
          </Link>

          <Link to="/servicios" onClick={closeMenu}>
            Servicios
          </Link>

          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          {!token && (
            <Link to="/login" onClick={closeMenu}>
              {"Iniciar sesi\u00f3n"}
            </Link>
          )}

          {token && (
            <>
              <Link to="/admin" className="admin-link" onClick={closeMenu}>
                {"Administraci\u00f3n"}
              </Link>

              <button type="button" className="logout-btn" onClick={handleLogout}>
                {"Cerrar sesi\u00f3n"}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
