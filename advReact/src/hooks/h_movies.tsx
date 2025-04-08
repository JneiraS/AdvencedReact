import React, { useEffect, useState } from "react";
import { Movies } from "../types/movies"; 
import { AddToListButton } from "../handlers/handleMovies";

const ListeMovies: React.FC = () => {
  // Déclaration des états
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movies[]>([]);
  const [chargement, setChargement] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Gestion de la saisie de l'utilisateur
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Si le champ de recherche est vide, on ne fait pas de requête
    if (!searchTerm) {
      setMovies([]);
      return;
    }

    const recupererMovies = async () => {
      setChargement(true);
      setErreur(null);
      try {
        // Utilisation de encodeURIComponent pour gérer les caractères spéciaux
        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(
          searchTerm
        )}&apikey=c90b7107`;
        const reponse = await fetch(url);
        if (!reponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const donnees = await reponse.json();
        if (donnees.Response === "False") {
          throw new Error(donnees.Error || "Aucun film trouvé");
        }
       
        setMovies(donnees.Search);
      } catch (error: any) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    };

    recupererMovies();
  }, [searchTerm]);

  return (
    <div>
        {/* Barre de recherche */}
        <input
        type="text"
        placeholder="Recherche"
        value={searchTerm}
        onChange={handleSearch}
      />
      <h1>Liste des Films</h1>
  
      {chargement ? (
        <p>Chargement...</p>
      ) : erreur ? (
        <p>Erreur : {erreur}</p>
      ) : movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
                 <li key={movie.imdbID}>
                 {movie.Title} ({movie.Year})
                 <img src={movie.Poster} alt={movie.Title} style={{ width: "150px", height: "225px" }} />
                 <AddToListButton movie={movie}/>               
                 </li>
          ))}
        </ul>
      ) : (
        <p>Aucun film trouvé</p>
      )}
    </div>
  );
};

export default ListeMovies;
