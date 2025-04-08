import axios from 'axios';
import { Movies } from "../types/movies"; 

const postMovies = async (data: Movies): Promise<Movies[]> => {
    try {
        const response = await axios.post<Movies[]>('http://localhost:3000/movies', data);
        const movies = Array.isArray(response.data) ? response.data.map((movie: Movies) => ({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Genre: movie.Genre,
            Poster: movie.Poster,
            Year: movie.Year,
        })) : [];
        return movies;
    } catch (error) {
        console.error('Error posting movies:', error);
        throw error;
    }
};


export const AddToListButton = ({ movie }: { movie: Movies }) => {
    return (
        <a className="add-btn" target="_blank" rel="noopener noreferrer" onClick={() => postMovies(movie)}>
            Ajouter à ma liste
        </a>
    );
};

const GetMovies = async (): Promise<Movies[]> => {
    try {
        const response = await axios.get<Movies[]>('http://localhost:3000/movies');
        const movies = Array.isArray(response.data) ? response.data.map((movie: Movies) => ({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Genre: movie.Genre,
            Poster: movie.Poster,
            Year: movie.Year,
        })) : [];
        return movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

export default AddToListButton; GetMovies;
