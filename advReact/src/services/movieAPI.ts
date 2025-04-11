import { Movies } from "../types/movies";
import axios from 'axios';


export const API_URL = 'http://localhost:3000';

/** 
Recherche de films à l'aide de l'API OMDb
 */
export const searchMovies = async (movieTitle: string): Promise<Movies[]> => {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=c90b7107`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des données");
  }

  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "Aucun film trouvé");
  }

  return data.Search;
};

// Interface pour interagir avec l'API JsonServer
export const MovieService = {
  getMovies: async () => {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  },

  /** Mise à jour de la note d'un film */
  updateMovieNote: async (movieId: string, note: string) => {
    //Mettre à jour l'enregistrement existant
    await axios.patch(`${API_URL}/movies/${movieId}`, {
      Note: note
    });
  },

  /** Ajout d'un film */
  createMovieWithNote: async (movie: Movies, note: string) => {
    await axios.post(`${API_URL}/movies`, {
      Title: movie.Title,
      Year: movie.Year,
      imdbID: movie.imdbID,
      Type: movie.Type,
      Poster: movie.Poster,
      Note: note
    });
  },


  /** Suppression d'un film */
  deleteMovie: async (movieId: string) => {
    const response = await axios.get(`${API_URL}/movies?imdbID=${movieId}`);

    for (const movie of response.data) {
      await axios.delete(`${API_URL}/movies/${movie.id}`);
    }
  }
}; 
