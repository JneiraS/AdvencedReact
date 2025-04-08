import ListeMovies from './hooks/h_movies'
import { Routes, Route } from "react-router";
import './App.css'
import Navbar from './components/navbar';


const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<ListeMovies />} />
          {/* <Route path="/todo" element={<UseCases />} /> */}
        </Routes>
      </div>
    </>
  );
};

export default App;