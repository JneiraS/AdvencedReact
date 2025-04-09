import { NavLink} from "react-router";
import { AddToListButton } from "../handlers/handleMovies";
import { Movies } from "../types/movies";


// Composant Navbar
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

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Composant de recherche
export  const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (  <input type="text"
    placeholder="Recherche"
    value={value}
    onChange={onChange} />
);

// Composant d'affichage d'un film
export const MovieItem: React.FC<{ movie: Movies }> = ({ movie }) => (
  <li>
    {movie.Title} ({movie.Year})
    <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
    <AddToListButton movie={movie} />
  </li>
);

export default Navbar; SearchBar; MovieItem;