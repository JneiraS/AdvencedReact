import { useState } from 'react';
import { Movies } from "../types/movies";
import { postMovies } from "../services/funcs";


// Composant pour le bouton d'ajout
export const AddToListButton = ({ movie }: { movie: Movies }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**  Fonction pour gérer l'ajout d'un film à la liste de films personnalisée*/
    const handleAddToList = async () => {
        try {
            // On indique que l'ajout est en cours
            setIsAdding(true);
            // On réinitialise l'erreur
            setError(null);
            await postMovies(movie);
            // Si tout s'est bien passé, on affiche un message de réussite
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError("Erreur lors de l'ajout du film");
        } finally {
            // On réinitialise l'état
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
