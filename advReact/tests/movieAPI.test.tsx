import { searchMovies } from '../src/services/movieAPI';
import { enableFetchMocks } from 'jest-fetch-mock';


// Mock de l'API fetch globale
global.fetch = jest.fn();

// Activer les mocks de fetch
enableFetchMocks();

describe('searchMovies', () => {
  // Réinitialise les mocks entre chaque test
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('devrait retourner un tableau de films lorsque la recherche est réussie', async () => {
    // Données fictives pour simuler la réponse de l'API
    const mockMovies = [
      { Title: 'Star Wars', Year: '1977', imdbID: 'tt0076759', Type: 'movie', Poster: 'url1' },
      { Title: 'Star Trek', Year: '2009', imdbID: 'tt0796366', Type: 'movie', Poster: 'url2' }
    ];
    
    // Mock de la réponse de fetch avec jest-fetch-mock
    fetchMock.mockResponseOnce(JSON.stringify({
      Response: 'True',
      Search: mockMovies
    }));

    // Appel de la fonction à tester
    const result = await searchMovies('star');

    // Vérifications
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.omdbapi.com/?s=star&apikey=c90b7107'
    );
    expect(result).toEqual(mockMovies);
  });

  it('devrait lancer une erreur si la réponse de fetch n\'est pas ok', async () => {
    // Mock d'une erreur de réseau
    fetchMock.mockResponseOnce('', { 
      status: 500,
      statusText: 'Internal Server Error'
    });

    // Test que la fonction lance bien une erreur
    await expect(searchMovies('star')).rejects.toThrow('Erreur lors du chargement des données');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('devrait lancer une erreur si aucun film n\'est trouvé', async () => {
    // Mock d'une réponse sans résultats
    fetchMock.mockResponseOnce(JSON.stringify({
      Response: 'False',
      Error: 'Movie not found!'
    }));

    // Test que la fonction lance bien une erreur avec le message de l'API
    await expect(searchMovies('inexistant')).rejects.toThrow('Movie not found!');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('devrait encoder correctement les termes de recherche avec des caractères spéciaux', async () => {
    // Mock de la réponse
    fetchMock.mockResponseOnce(JSON.stringify({
      Response: 'True',
      Search: []
    }));

    // Terme de recherche avec des caractères spéciaux
    const searchTerm = 'star & wars';
    await searchMovies(searchTerm);

    // Vérification que l'URL est correctement encodée
    expect(fetchMock).toHaveBeenCalledWith(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=c90b7107`
    );
  });
});