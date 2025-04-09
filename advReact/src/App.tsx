import ListeMovies from './hooks/h_movies'
import { Routes, Route } from "react-router";
import './App.css'
import Navbar from './components/home';
import MovieList from './handlers/handleMovies';


const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<ListeMovies />} />
          <Route path="/ma-liste" element={<MovieList />} />
        </Routes>
      </div>
    </>
  );
};

export default App;