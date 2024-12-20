import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Cast.css";
import { useParams } from "react-router-dom";
import { AuthContext } from './../../../../context/AuthContext';  

function Cast() {
  const { movieId } = useParams();
  const { accessToken } = useContext(AuthContext);
  const [casts, setCasts] = useState([]);
  const [movie, setMovie] = useState([]);
  const [formData, setFormData] = useState({
    castName: "",
    characterName: "",
    imageUrl: "",
  });
  const [selectedCast, setSelectedCast] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://via.placeholder.com/200x300?text=No+Image"
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const getCasts = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/casts/${movieId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCasts(response.data);
    } catch (error) {
      console.error("Error fetching casts:", error);
    }
  };

  const getMovies = async () => {
    try {
      const response = await axios.get(`/movies/${movieId}`);
      setMovie(response.data);
    } catch (err) {
      console.error("Error fetching movie data:", err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { castName, characterName, imageUrl } = formData;

    const castData = {
      userId: "2",
      movieId: movieId,
      name: castName,
      characterName,
      url: imageUrl,
    };

    const method = selectedCast ? "PATCH" : "POST";
    const url = selectedCast ? `/admin/casts/${selectedCast.id}` : `/admin/casts`;

    try {
      await axios({
        method,
        url,
        data: castData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getCasts(); 
      handleCancel();
      setErrorMessage(null); 
    } catch (error) {
      console.error("Error saving cast:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to save cast.");
    }
  };

  const handleRowClick = (cast) => {
    setSelectedCast(cast);
    setFormData({
      castName: cast.name || "",
      characterName: cast.characterName || "",
      imageUrl: cast.url || "",
    });
    setPreviewUrl(cast.url || "https://via.placeholder.com/200x300?text=No+Image");
  };

  const handleDelete = async () => {
    if (!selectedCast) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCast.name}?`)) {
      return;
    }

    try {
      await axios.delete(`/admin/casts/${selectedCast.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCasts(casts.filter((cast) => cast.id !== selectedCast.id));
      handleCancel();
      setErrorMessage(null); 
    } catch (error) {
      console.error("Error deleting cast:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to delete cast.");
    }
  };

  const handleCancel = () => {
    setSelectedCast(null);
    setFormData({
      castName: "",
      characterName: "",
      imageUrl: "",
    });
    setPreviewUrl("https://via.placeholder.com/200x300?text=No+Image");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "imageUrl") {
        setPreviewUrl(updatedData.imageUrl || "https://via.placeholder.com/200x300?text=No+Image");
      }
      return updatedData;
    });
  };

  const handleImageError = () => {
    setPreviewUrl("https://via.placeholder.com/200x300?text=No+Image");
  };

  useEffect(() => {
    getCasts();
    getMovies();
  }, [movieId]);

  return (
    <div className="cast-container">
      <div className="cast-form-container">
        <h2>{selectedCast ? "Edit Cast" : "Add Cast"}</h2>
        <div className="form-with-preview">
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" onError={handleImageError} />
          </div>
          <form onSubmit={handleSubmit} className="form-section">
            <label htmlFor="castName">Name:</label>
            <input
              type="text"
              id="castName"
              name="castName"
              value={formData.castName}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="characterName">Character Name:</label>
            <input
              type="text"
              id="characterName"
              name="characterName"
              value={formData.characterName}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
            <br />
            <button type="submit">{selectedCast ? "Save" : "Add"}</button>
            {selectedCast && (
              <>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </form>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>

      <div className="cast-list-container">
        <h2>Cast List</h2>
        <table className="cast-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Character</th>
            </tr>
          </thead>
          <tbody>
            {casts.length > 0 ? (
              casts.map((cast) => (
                <tr key={cast.id} onClick={() => handleRowClick(cast)}>
                  <td>{cast.id}</td>
                  <td>{cast.name}</td>
                  <td>{cast.characterName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No casts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cast;
