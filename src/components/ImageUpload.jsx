import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ImageUpload = ({ onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    
    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    } else {
      formData.append('image', files[0]);
    }

    try {
      const endpoint = multiple ? '/api/upload/images' : '/api/upload/image';
      const response = await axios.post(`http://localhost:4000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

      alert('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="upload-area">
        {preview && !multiple && (
          <div className="preview">
            <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          multiple={multiple}
          disabled={uploading}
          className="file-input"
        />
        
        {uploading && <div className="loading">Uploading...</div>}
      </div>
    </div>
  );
};

export default ImageUpload;