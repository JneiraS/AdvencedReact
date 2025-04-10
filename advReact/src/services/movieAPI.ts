import { Movies } from "../types/movies";


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