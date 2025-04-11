import { useEffect, useState } from "react";
import { Movies } from "../types/movies";
import { searchMovies } from "../services/movieAPI";
import { useDebounce } from 'use-debounce';




/**
 * Hook pour la recherche de films
 * @param searchTerm 
 * @returns Liste de films, statut de chargement et erreur
 */
export const useMoviesSearch = (searchTerm: string) => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 800);

// Se déclenche lorsque le terme de recherche débounced change.
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
        // On met à jour les résultats
        setMovies(results);
      // Gestion des erreurs
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

  return { movies, isLoading, error };
};

export default useMoviesSearch;


