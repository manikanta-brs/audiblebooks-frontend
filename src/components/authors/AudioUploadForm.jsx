import React, { useState } from "react";
import styled from "styled-components";

const AudioUploadForm = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
    } else {
      setAudioFile(null);
      setAudioURL(null);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageURL(url);
    } else {
      setImageFile(null);
      setImageURL(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUploadSuccess(false);
    setUploadError(null);

    if (!audioFile || !imageFile || !title || !description || !category) {
      setUploadError(
        "Please fill in all fields and select both audio and image files."
      );
      return;
    }

    const formData = new FormData();
    formData.append("audiobook", audioFile);
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      const token = localStorage.getItem("authorToken");
      const response = await fetch("/api/audiobooks/uploadaudiobook", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setAudioFile(null);
        setImageFile(null);
        setAudioURL(null);
        setImageURL(null);
        setTitle("");
        setDescription("");
        setCategory("");
      } else {
        const errorData = await response.json();
        setUploadError(errorData.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Error during upload. Please check console.");
    }
  };

  return (
    <StyledWrapper>
      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Wrap in form and handle onSubmit */}
          <label className="custom-file-upload" htmlFor="image-file">
            <span>Click to upload book cover</span>
            <input
              type="file"
              id="image-file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          <label className="custom-file-upload" htmlFor="audio-file">
            <span>Click to upload audio file</span>
            <input
              type="file"
              id="audio-file"
              accept="audio/*"
              onChange={handleAudioChange}
            />
          </label>
          {/* Audio Preview */}
          {audioURL && (
            <div className="preview-container">
              <audio controls className="audio-preview">
                <source src={audioURL} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
          {/* Image Preview */}
          {imageURL && (
            <div className="preview-container">
              <img src={imageURL} alt="Preview" className="image-preview" />
            </div>
          )}
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button type="submit">Upload</button>
        </form>

        {uploadSuccess && <p style={{ color: "green" }}>Upload successful!</p>}
        {uploadError && (
          <p style={{ color: "red" }}>Upload failed: {uploadError}</p>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .upload-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .custom-file-upload {
    cursor: pointer;
    border: 2px dashed #cacaca;
    padding: 1rem;
    text-align: center;
  }
  .preview-container {
    margin-top: 10px;
  }
  .audio-preview,
  .image-preview {
    width: 100%;
  }
`;

export default AudioUploadForm;
