import React, { useState } from 'react';
import api from '../services/api';

export default function UploadPayslip({ userId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      const base64 = await toBase64(file);
      // Server uses authenticated user ID, no need to send it
      const res = await api.post('/payslip/upload', { fileBase64: base64 });
      alert("Payslip uploaded successfully!");
      console.log(res.data);
      setFile(null);
    } catch (err) {
      const message = err.response?.data?.error || "Upload failed";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  return (
    <div>
      <input 
        type="file" 
        onChange={e => setFile(e.target.files[0])}
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Payslip'}
      </button>
    </div>
  );
}
