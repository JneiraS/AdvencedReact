import { useEffect, useState } from "react";
import { GetMovies } from "../handlers/handleMovies";

import { Movies} from "../types/movies"; 

  // Composant MovieList
  const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadMovies = async () => {
        try {
          setLoading(true);
          const fetchedMovies = await GetMovies();
          setMovies(fetchedMovies);
          setError(null);
        } catch (err) {
          setError('Failed to load movies. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      loadMovies();
    }, []);
  
    if (loading) {
      return <div className="loading">Loading movies...</div>;
    }
  
    if (error) {
      return <div className="error">{error}</div>;
    }
  
    return (
      <div className="movie-list">
        <h1>Movies</h1>
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img 
                src={movie.Poster} 
                alt={`${movie.Title} poster`} 
                className="movie-poster"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
              <div className="movie-info">
                <h2>{movie.Title}</h2>
                <p>{movie.Year}</p>
                <p>{movie.Genre}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MovieList;


