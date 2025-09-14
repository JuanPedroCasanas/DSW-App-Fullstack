import { Link } from "react-router-dom";
import "./Header.css"; 

function Header() {
  return (
    <header className="header">
      <h1>Consultorio Narrativas</h1>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Sobre Nosotros</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
