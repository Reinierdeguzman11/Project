import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Photos.css";
import { useParams } from "react-router-dom";

function Photos() {
  const { movieId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://via.placeholder.com/200x300?text=No+Image"
  );
  
  const userId = "2";
  const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzhmNmMyYTY2YmNkYjUyM2Y3YjBkZGRhMTMyYzcyZiIsIm5iZiI6MTczMzM2NjY1OC4zNDUsInN1YiI6IjY3NTExMzgyYWZmZTNhNWMyZjJhNTNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dQZKGhWCGcsrXa2Ec1-j6dWYsDy7tci6CpELPMuHUuAeyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzhmNmMyYTY2YmNkYjUyM2Y3YjBkZGRhMTMyYzcyZiIsIm5iZiI6MTczMzM2NjY1OC4zNDUsInN1YiI6IjY3NTExMzgyYWZmZTNhNWMyZjJhNTNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dQZKGhWCGcsrXa2Ec1-j6dWYsDy7tci6CpELPMuHUuA"

  const getPhotos = async () => {
    try {
      const response = await axios.get(`/photos/2`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (Array.isArray(response.data)) {
        setPhotos(response.data);
      }
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const photoData = {
      userId: userId,
      movieId: movieId,
      url: imageUrl,
      description: description,
    };

    const method = selectedPhoto ? "PATCH" : "POST";
    const url = selectedPhoto ? `/photos/${selectedPhoto.id}` : "/photos";
    
    try {
      const response = await axios({
        method: method,
        url: url,
        data: photoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Photo saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving photo:", error.response ? error.response.data : error.message);
    } finally {
      handleCancel();
      getPhotos();
    }
  };

  const handleRowClick = (photo) => {
    setSelectedPhoto(photo);
    setImageUrl(photo.url || "");
    setDescription(photo.description || "");
    setPreviewUrl(photo.imageUrl || "https://via.placeholder.com/200x300?text=No+Image");
  };

  const handleCancel = () => {
    setSelectedPhoto(null);
    setDescription("");
    setImageUrl("");
    setPreviewUrl("https://via.placeholder.com/200x300?text=No+Image");
  };

  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl("https://via.placeholder.com/200x300?text=No+Image");
    }
  }, [imageUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "url") {
      setImageUrl(value);
      if (selectedPhoto) {
        setSelectedPhoto({
          ...selectedPhoto,
          imageUrl: value,
        });
      }
    } else if (name === "name") {
      setDescription(value);
      if (selectedPhoto) {
        setSelectedPhoto({
          ...selectedPhoto,
          name: value,
        });
      }
    }
  };

  const handleImageError = () => {
    setPreviewUrl("https://via.placeholder.com/200x300?text=No+Image");
  };

  return (
    <div className="photos-container">
      <div className="photos-form-container">
        <h2>{selectedPhoto ? "Edit Photo" : "Add Photo"}</h2>
        <div className="form-with-preview">
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" onError={handleImageError} />
          </div>
          <form className="form-section">
            <label>
              Description:
              <input
                type="text"
                name="name"
                value={description}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              URL:
              <input
                type="url"
                name="url"
                value={imageUrl}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="submit" onClick={handleSubmit}>{selectedPhoto ? "Save" : "Add"}</button>
            {selectedPhoto && (
              <button type="button" className="save-button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="photos-list-container">
        <h2>Photo List</h2>
        <table className="photos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {photos.length > 0 ? (
              photos.map((photo) => (
                <tr key={photo.id} onClick={() => handleRowClick(photo)}>
                  <td>{photo.id}</td>
                  <td>{photo.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No photos found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Photos;