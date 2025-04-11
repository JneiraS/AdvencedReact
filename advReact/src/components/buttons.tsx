import { useState } from 'react';
import { Movies } from "../types/movies";
import { postMovies } from "../services/funcs";


// Composant pour le bouton d'ajout
export const AddToListButton = ({ movie }: { movie: Movies }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**  Fonction pour gérer l'ajout d'un film à la liste de films fav*/
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
