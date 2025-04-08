import { NavLink} from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Accueil
          </NavLink>
        </li>
        <li className="navbar-item">
            <NavLink to="/ma-liste" className={({ isActive }) => (isActive ? "active" : "")}>
            Ma Liste
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;