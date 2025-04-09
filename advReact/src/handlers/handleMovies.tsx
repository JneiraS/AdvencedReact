import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movies, MovieAPIResponse } from "../types/movies";

// Fonction pour ajouter un film à la liste
const postMovies = async (data: Movies): Promise<Movies | null> => {
    try {
        const response = await axios.post<Movies>('http://localhost:3000/movies', data);
        return response.data;
    } catch (error) {
        console.error('Error posting movies:', error);
        throw error;
    }
};

// Composant pour le bouton d'ajout
export const AddToListButton = ({ movie }: { movie: Movies }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddToList = async () => {
        try {
            setIsAdding(true);
            setError(null);
            await postMovies(movie);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError("Erreur lors de l'ajout du film");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <button
            className="add-btn"
            onClick={handleAddToList}
            disabled={isAdding}
        >
            {isAdding ? 'Ajout en cours...' : success ? 'Ajouté !' : 'Ajouter à ma liste'}
            {error && <div className="error-message">{error}</div>}
        </button>
    );
};

// Fonction pour récupérer les films de l'API
export const fetchMoviesFromAPI = async (): Promise<MovieAPIResponse[]> => {
    try {
        const response = await axios.get<MovieAPIResponse[]>('http://localhost:3000/movies');

        // Vérifier si la réponse est un tableau
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
            await axios.post('http://localhost:3000/movies', {
           
                Title: movie.Title,
                Year: movie.Year,
                imdbID: movie.imdbID,
                Type: movie.Type,
                Poster: movie.Poster,
                Note: note 
            });
            console.log("Note submitted successfully");
        } catch (err) {
            console.error("Error submitting note:", err);
        } finally {
            setAdding(false);
        }
        await handleDelete(movie.imdbID);
    };

    const handleDelete = async (movieId: string) => {
        try {
            await axios.delete(`http://localhost:3000/movies/${movieId}`);
            setMovies((prevMovies) => prevMovies.filter((prevMovie) => prevMovie.imdbID !== movieId));
            console.log(`Movie with ID ${movieId} deleted successfully`);
        } catch (err) {
            console.error("Error deleting movie:", err);
        }
    };

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                const fetchedMovies = await getMovies();
                console.log("Films récupérés:", fetchedMovies);
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
                                            Submit Note
                                        </button>
                                    </>
                                )}
                                <p>Note: {movie.Note}</p>
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