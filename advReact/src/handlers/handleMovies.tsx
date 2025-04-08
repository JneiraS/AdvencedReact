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
interface MovieAPIResponse {
    imdbID: string;
    Title: string;
    Genre: string;
    Poster: string;
    Year: string;
    // Ajouter d'autres propriétés si nécessaire
}



const fetchMoviesFromAPI = async (): Promise<MovieAPIResponse[]> => {
    try {
        const response = await axios.get<MovieAPIResponse[]>('http://localhost:3000/movies');
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid response format');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

const transformMovieData = (movies: MovieAPIResponse[]): Movies[] => {
    return movies.map((movie) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Genre: movie.Genre,
        Poster: movie.Poster,
        Year: movie.Year,
    }));
};

const getMovies = async (): Promise<Movies[]> => {
    const movies = await fetchMoviesFromAPI();
    return transformMovieData(movies);
};



export default AddToListButton; getMovies;
