import { Movies } from "../types/movies";
import axios from 'axios';

/**
 * Fonction pour ajouter un film à la liste
 */
export const postMovies = async (data: Movies): Promise<Movies | null> => {
    try {
        // Envoie une requête POST pour ajouter le film
        const response = await axios.post<Movies>('http://localhost:3000/movies', data);
        // Retourne les données du film ajouté
        return response.data;
    } catch (error) {
        console.error('Error posting movies:', error);
        throw error;
    }
};

// Fonction pour récupérer les films de l'API
export const fetchMoviesFromAPI = async (): Promise<Movies[]> => {
    try {
        const response = await axios.get<Movies[]>('http://localhost:3000/movies');

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

// Fonction pour récupérer et transformer les films
export const getMovies = async (): Promise<Movies[]> => {
    const movies = await fetchMoviesFromAPI();
    return movies;
};
