import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './List.css';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
    console.log(accessToken);
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
        });
    }
  };

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  
  const filteredMovies = lists.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lists-container">
      <div className="header">
        <h1>Movies</h1>
        <button
          className="create-button"
          onClick={() => navigate('/main/movies/form')}
        >
          + 
        </button>
        <input
          type="text"
          placeholder="Search movies..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A'}</p>
            <div className="movie-actions">
              <button
                className="action-button edit-button"
                onClick={() => navigate(`/main/movies/form/${movie.id}`)}
              >
                Edit
              </button>
              <button
                className="action-button delete-button"
                onClick={() => handleDelete(movie.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lists;
