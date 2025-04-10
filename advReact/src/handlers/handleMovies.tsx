import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movies } from "../types/movies";
import { MovieService,API_URL } from "../services/movieAPI";
import { getMovies } from '../services/funcs';



const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [noteValues, setNoteValues] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchMovies();
    }, []);
    // Récupération de la liste des films
    const fetchMovies = async () => {
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

    /** Met à jour la note d'un film dans l'état local */
    const handleNoteChange = (movieId: string, note: string) => {
        setNoteValues(prev => ({ ...prev, [movieId]: note }));
    };

    /** Envoie la note d'un film à l'API JsonServer et met à jour l'état local */
    const handleSubmitNote = async (movie: Movies, note: string) => {
        setAdding(true);
        try {
            const existing = await fetchMovieByImdbID(movie.imdbID);

            if (existing.length > 0) {
                await MovieService.updateMovieNote(existing[0].id, note);
            } else {
                await MovieService.createMovieWithNote(movie, note);
            }

            updateLocalMovieNote(movie.imdbID, note);
        } catch (err) {
            console.error("Erreur lors de la soumission de la note:", err);
        } finally {
            setAdding(false);
        }
    };

    /** Récupère un film par son imdbID */
    const fetchMovieByImdbID = async (imdbID: string) => {
        const response = await axios.get(`${API_URL}/movies?imdbID=${imdbID}`);
        return response.data;
    };

    /** Met à jour la note d'un film dans l'état local */
    const updateLocalMovieNote = (imdbID: string, note: string) => {
        setMovies(prev =>
            prev.map(movie =>
                movie.imdbID === imdbID ? { ...movie, Note: note } : movie
            )
        );
    };
    /**  Rendu des cartes de film */
    const renderMovieCard = (movie: Movies) => {
        const note = noteValues[movie.imdbID] || '5';

        return (
            <div key={movie.imdbID} className="movie-card">
                <img
                    src={movie.Poster}
                    alt={`${movie.Title} poster`}
                    className="movie-poster"
                />
                <div className="movie-info">
                    <h2>{movie.Title}</h2>
                    {movie.Note === "" || movie.Note === undefined ? (
                        <>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={note}
                                onChange={(e) => handleNoteChange(movie.imdbID, e.target.value)}
                            />
                            <p>Note: {note}</p>
                            <button
                                className="submit-note-btn"
                                onClick={() => handleSubmitNote(movie, note)}
                                disabled={adding}
                            >
                                {adding ? 'Enregistrement...' : 'Soumettre la note'}
                            </button>
                        </>
                    ) : (
                        <p>Note: {movie.Note}</p>
                    )}
                </div>
            </div>
        );
    };

    /**Fonction pour afficher la liste des films ou un message d'erreur*/
    const renderContent = () => {
        if (loading) return <div className="loading">Chargement des films...</div>;
        if (error) return <div className="error-message">{error}</div>;
        if (movies.length === 0) return <div className="no-movies">Aucun film trouvé</div>;

        return (
            <div className="movies-grid">
                {movies.map(renderMovieCard)}
            </div>
        );
    };

    return (
        <div className="movie-list">
            <h1>Liste des films</h1>
            {renderContent()}
        </div>
    );
};

export default MovieList;
