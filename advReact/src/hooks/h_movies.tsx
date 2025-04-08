import React, { useEffect, useState } from "react";
import { Movie } from "../types/movies"; // Supposons que l'interface s'appelle Movie

const ListeMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const recupererMovies = async () => {
      try {
        const reponse = await fetch("https://www.omdbapi.com/?s=Seven&apikey=c90b7107");
        if (!reponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const donnees = await reponse.json();
        // L'API renvoie une réponse avec une propriété "Search" qui est un tableau
        if (donnees.Response === "False") {
          throw new Error(donnees.Error || "Aucun film trouvé");
        }
        setMovies(donnees.Search);
      } catch (error) {
        if (error instanceof Error) {
          setErreur(error.message);
        }
      } finally {
        setChargement(false);
      }
    };

    recupererMovies();
  }, []);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;

  return (
    <div>
      <h1>Résultats</h1>
      <ul>
        {movies.map((movie) => (
          <li id={movie.imdbID}>
            {movie.Title} ({movie.Year})
            <img src={movie.Poster} alt={movie.Title} style={{ width: "100px", height: "150px" }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeMovies;
