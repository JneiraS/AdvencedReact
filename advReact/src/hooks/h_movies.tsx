import React, { useEffect, useState } from "react";
import { Movies } from "../types/movies"; 
import { AddToListButton } from "../handlers/handleMovies";
import { searchMovies } from "../services/movieAPI";



// Composant de recherche
const SearchBar: React.FC<{ value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, onChange }) => (
  <input type="text" placeholder="Recherche" value={value} onChange={onChange} />
);

// Composant d'affichage d'un film
const MovieItem: React.FC<{ movie: Movies }> = ({ movie }) => (
  <li>
    {movie.Title} ({movie.Year})
    <img src={movie.Poster} alt={movie.Title} className="movie-poster" style={{ width: "150px", height: "225px" }} />
    
    <AddToListButton movie={movie} />
  </li>
);


const ListeMovies: React.FC = () => {
  // Déclaration des états
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movies[]>([]);
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Gestion de la saisie de l'utilisateur
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  useEffect(() => {
    // Si le champ de recherche est vide, on ne fait pas de requête
    if (!searchTerm) {
      setMovies([]);
      return;
    }
    const fetchMovies = async () => {
      try {
        setChargement(true);
        const data = await searchMovies(searchTerm);
        setMovies(data);
        setErreur(null);
      } catch (error: any) {
        setErreur(error.message);
        setMovies([]);
      } finally {
        setChargement(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <h1>Liste des Films</h1>
  
      {chargement ? (
        <p>Chargement...</p>
      ) : erreur ? (
        <p>Erreur : {erreur}</p>
      ) : movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
        
        <MovieItem key={movie.imdbID} movie={movie} />

          ))}
        </ul>
      ) : (
        <p>Aucun film trouvé</p>
      )}
    </div>
  );
};

export default ListeMovies;
