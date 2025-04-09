import { Movies } from "../types/movies";


// services/movieApi.ts
export const searchMovies = async (searchTerm: string): Promise<Movies[]> => {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=c90b7107`;
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