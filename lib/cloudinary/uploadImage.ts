"use client";

import { useState } from "react";

export function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const cloudName = "dcvgd4fth";

  async function uploadImage(file: File) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lovely upload"); // change to your preset

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setUrl(data.secure_url);
      return data;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function uploadRawFile(file: File) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lovely upload");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setUrl(data.secure_url);
      }

      return data;
    } catch (err) {
      console.error("Raw file upload failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { uploadImage, uploadRawFile, url, loading };
}
