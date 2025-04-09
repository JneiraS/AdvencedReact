import React, { useEffect, useState } from "react";
import { Movies } from "../types/movies";
import { searchMovies } from "../services/movieAPI";
import { useDebounce } from 'use-debounce'; 
import { SearchBar, MovieItem } from "../components/home";





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

const ListeMovies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<Movies[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedSearchTerm) {
        setMovies([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchMovies(debouncedSearchTerm);
        setMovies(results);
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Une erreur inattendue est survenue';
        setError(errorMessage);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearchTerm]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      <h1>Liste des Films</h1>
      {renderContent(isLoading, error, movies)}
    </div>
  );
};

export default ListeMovies;


