import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movies, MovieAPIResponse } from "../types/movies";
import { MovieService } from "../services/movieAPI";

/**
 * Fonction pour ajouter un film à la liste
 * @param data - Les données du film à ajouter
 * @returns Le film ajouté ou null en cas d'erreur
 */
export const postMovies = async (data: Movies): Promise<Movies | null> => {
    try {
        // Envoie une requête POST pour ajouter le film
        const response = await axios.post<Movies>('http://localhost:3000/movies', data);
        
        // Retourne les données du film ajouté
        return response.data;
    } catch (error) {
        // Log l'erreur en cas d'échec
        console.error('Error posting movies:', error);
        
        // Relance l'erreur pour gestion en amont
        throw error;
    }
};



// Fonction pour récupérer les films de l'API
export const fetchMoviesFromAPI = async (): Promise<MovieAPIResponse[]> => {
    try {
        const response = await axios.get<MovieAPIResponse[]>('http://localhost:3000/movies');

        if (!Array.isArray(response.data)) {
            console.error("La réponse n'est pas un tableau : ", response.data);
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// Fonction pour transformer les données de l'API
export const transformMovieData = (movies: MovieAPIResponse[]): Movies[] => {
    return movies.map((movie) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Type: movie.Type || "movie", // Valeur par défaut si manquante
        Poster: movie.Poster,
        Year: movie.Year,
        Note: movie.Note || "",
    }));
};

// Fonction pour récupérer et transformer les films
export const getMovies = async (): Promise<Movies[]> => {
    const movies = await fetchMoviesFromAPI();
    return transformMovieData(movies);
};

// Composant principal pour afficher la liste de films
const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [note, setNote] = useState<string>('');

    const handleSubmitNote = async (movie: Movies, note: string) => {
        try {
          setAdding(true);
          
          // Récupérer l'ID de la base de données
          const response = await axios.get(`http://localhost:3000/movies?imdbID=${movie.imdbID}`);
          
          if (response.data.length > 0) {
            MovieService.updateMovieNote(response.data[0].id, note);

          } else {
            // Créer un nouvel enregistrement si nécessaire
            await axios.post('http://localhost:3000/movies', {
              Title: movie.Title,
              Year: movie.Year,
              imdbID: movie.imdbID,
              Type: movie.Type,
              Poster: movie.Poster,
              Note: note
            });
          }
          
          // Mise à jour locale
          setMovies((prevMovies) => prevMovies.map(
            (m) => m.imdbID === movie.imdbID ? { ...m, Note: note } : m
          ));
          
        } catch (err) {
          console.error("Erreur lors de la soumission de la note:", err);
        } finally {
          setAdding(false);
        }
      };
    // const handleDelete = async (movieId: string) => {
    //     await axios.get(`http://localhost:3000/movies?imdbID=${movieId}`).then(async (res) => {
    //         for (const movie of res.data) {
    //             await axios.delete(`http://localhost:3000/movies/${movie.id}`);
    //         }
    //     });
    // };

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const fetchedMovies = await getMovies();
                setMovies(fetchedMovies);
            } catch (err) {
                console.error("Erreur lors du chargement des films:", err);
                setError("Impossible de charger les films. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    if (loading) {
        return <div className="loading">Chargement des films...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movie-list">
            <h1>Liste des films</h1>
            {movies.length === 0 ? (
                <div className="no-movies">Aucun film trouvé</div>
            ) : (
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
                                {movie.Note === "" && (
                                    <>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                        <p>Note: {note}</p>
                                        <button
                                            className="submit-note-btn"
                                            onClick={() => handleSubmitNote(movie, note)}
                                            disabled={adding}
                                        >
                                            Soumettre la note
                                        </button>
                                    </>
                                )}
                                {movie.Note && <p>Note: {movie.Note}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export { MovieList };
export default MovieList;
