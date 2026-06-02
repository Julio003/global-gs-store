import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="nav">
        <Link to="/" className="logo">
          Global-GS Store
        </Link>

        <nav className="menu">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/admin" className="admin-link">
            Administración
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;