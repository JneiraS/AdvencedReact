import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movies } from "../types/movies";
import { MovieService } from "../services/movieAPI";
import { getMovies } from '../services/funcs';




// Composant principal pour afficher la liste de films
const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [noteValues, setNoteValues] = useState<Record<string, string>>({});


    /** Met à jour la valeur de note d'un film dans l'objet noteValues*/
    const handleNoteChange = (movieId: string, value: string) => {
        setNoteValues(prev => ({
            ...prev,
            [movieId]: value
        }));
    };


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
                                            value={noteValues[movie.imdbID] || '5'}
                                            onChange={(e) => handleNoteChange(movie.imdbID, e.target.value)}
                                        />
                                        <p>Note: {noteValues[movie.imdbID] || '5'}</p>
                                        <button
                                            className="submit-note-btn"
                                            onClick={() => handleSubmitNote(
                                                movie,
                                                noteValues[movie.imdbID] || '5'
                                            )}
                                            disabled={adding}
                                        >
                                            {adding ? 'Enregistrement...' : 'Soumettre la note'}
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
