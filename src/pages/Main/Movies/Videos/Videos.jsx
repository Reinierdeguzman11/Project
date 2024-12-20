import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Videos.css";
import { useParams } from "react-router-dom";

function Videos() {
  const { movieId } = useParams();
  const [videos, setVideos] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [site, setSite] = useState("");
  const [videoType, setVideoType] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [official, setOfficial] = useState(false);
  const [editing, setEditingMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");

  const userId = "2";
  
  const accessToken ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGZkMDdiZTk3OTgwM2RlODhmMGY5ZTgyNmJjOGExMCIsIm5iZiI6MTczMzM2NjY1OC4zNDUsInN1YiI6IjY3NTExMzgyYWZmZTNhNWMyZjJhNTNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1-dm_ysYZXtMfRPKoBA1nD8dyBxRVgqKOdm_e3UKGpg";

  const getVideos = async () => {
    try {
      const response = await axios.get(`/videos/${movieId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video List:", response.data);
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const videoData = {
      userId: userId,
      movieId: movieId,
      url: videoUrl,
      name: videoName,
      site: site,
      videoType: videoType,
      videoKey: videoKey,
      official: official,
    };

    const method = selectedVideo ? "PATCH" : "POST";
    const url = selectedVideo
      ? `/admin/videos/${selectedVideo.id}`
      : "/admin/videos";

    try {
      const response = await axios({
        method: method,
        url: url,
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Video saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving video:", error.response ? error.response.data : error.message);
    } finally {
      handleCancel();
      getVideos();
    }
  };

  const handleRowClick = (video) => {
    setSelectedVideo(video);
    setVideoName(video.name || "");
    setVideoUrl(video.url || "");
    setSite(video.site || "");
    setVideoType(video.videoType || "");
    setVideoKey(video.videoKey || "");
    setOfficial(video.official || false);
    setVideoPreviewUrl(video.url || "");
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;
    console.log(selectedVideo.id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the video: ${selectedVideo.name}?`
    );
    
    if (confirmDelete) {
      try {
        const response = await axios.delete(`/admin/videos/${selectedVideo.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("Video deleted successfully:", response.data);
        setVideos(videos.filter((video) => video.id !== selectedVideo.id));
      } catch (error) {
        console.error("Error deleting video:", error.response ? error.response.data : error.message);
      } finally {
        handleCancel();
        getVideos();
      }
    }
  };

  const handleCancel = () => {
    setSelectedVideo(null);
    setVideoName("");
    setVideoUrl("");
    setSite("");
    setVideoType("");
    setVideoKey("");
    setOfficial(false);
    setVideoPreviewUrl("");
  };

  useEffect(() => {
    getVideos();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "url") {
      setVideoUrl(value);
      setVideoPreviewUrl(value);
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          url: value,
        });
      }
    } else if (name === "name") {
      setVideoName(value);
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          name: value,
        });
      }
    } else if (name === "site") {
      setSite(value);
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          site: value,
        });
      }
    } else if (name === "videoType") {
      setVideoType(value);
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          videoType: value,
        });
      }
    } else if (name === "videoKey") {
      setVideoKey(value);
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          videoKey: value,
        });
      }
    } else if (name === "official") {
      setOfficial(value === "true");
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          official: value === "true",
        });
      }
    }
  };

  return (
    <div className="videos-container">
      <div className="videos-form-container">
        <h2>{selectedVideo ? "Edit Video" : "Add Video"}</h2>
        <form className="form-section">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={videoName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            URL:
            <input
              type="url"
              name="url"
              value={videoUrl}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Site:
            <input
              type="text"
              name="site"
              value={site}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Video Type:
            <input
              type="text"
              name="videoType"
              value={videoType}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Video Key:
            <input
              type="text"
              name="videoKey"
              value={videoKey}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Official:
            <select name="official" value={official} onChange={handleInputChange}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <br />
          {/* Video Preview */}
          {videoPreviewUrl && (
            <div className="video-preview-container">
              <video width="320" height="240" controls>
                <source src={videoPreviewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <br />
          <button type="submit" onClick={handleSubmit}>
            {selectedVideo ? "Save" : "Add"}
          </button>
          {selectedVideo && (
            <button type="button" className="save-button" onClick={handleCancel}>
              Cancel
            </button>
          )}
          {selectedVideo && (
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </form>
      </div>
      <div className="videos-list-container">
        <h2>Video List</h2>
        <table className="videos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {videos.length > 0 ? (
              videos.map((video) => (
                <tr key={video.id} onClick={() => handleRowClick(video)}>
                  <td>{video.id}</td>
                  <td>{video.name}</td>
                  <td>{video.url}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No videos found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Videos;