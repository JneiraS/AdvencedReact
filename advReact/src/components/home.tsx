import { NavLink } from "react-router";
import { AddToListButton } from "../components/buttons";
import { Movies } from "../types/movies";
import React, { useState } from "react";
import { useMoviesSearch } from "../hooks/hook_movies";


// Composant Navbar
export const Navbar = () => {
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
export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (<input type="text"
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

/**  Composant principal pour afficher la liste de films */
export const renderContent = (
  isLoading: boolean,
  error: string | null,
  movies: Movies[]
) => {
  if (isLoading) return <p>Chargement...</p>; 
  if (error) return <p>Erreur : {error}</p>;
  if (movies.length > 0) {
    return (
      <ul>
        {movies.map((movie) => (
          <MovieItem key={movie.imdbID} movie={movie} />
        ))}
      </ul>
    );
  }
  return <p>Aucun film trouvé</p>;
};

//Composant React pour afficher et rechercher des films
export const ListeMovies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { movies, isLoading, error } = useMoviesSearch(searchTerm);


  // Fonction pour gérer la recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      <h1>Liste des Films</h1>
      {renderContent(isLoading, error, movies)}
    </div>
  );
};

export default Navbar; MovieItem; ListeMovies;