import ListeMovies from './hooks/h_movies'
import { Routes, Route } from "react-router";
import './App.css'
import Navbar from './components/navbar';
import MyList from './components/myList';


const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<ListeMovies />} />
          <Route path="/ma-liste" element={<MyList />} />
        </Routes>
      </div>
    </>
  );
};

export default App;