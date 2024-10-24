import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Toaster, toast } from "react-hot-toast";
import { useApiUrl } from '@/hooks/useApiUrl';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = useApiUrl();

  const axiosInstance = axios.create({
    timeout: 30000, // Increased timeout to 30 seconds
    withCredentials: false, // Explicitly set this to false
  });

  const fetchFiles = useCallback(async () => {
    if (!apiUrl) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching files from: ${apiUrl}/files/`);
      const response = await fetch(`${apiUrl}/files/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to fetch files: ${errorMessage}`);
      toast.error(`Failed to fetch files. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (apiUrl) {
      fetchFiles();
    }
  }, [fetchFiles, apiUrl]);

  const onDrop = async (acceptedFiles: any[]) => {
    if (!apiUrl) {
      toast.error('API URL is not set');
      return;
    }
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('file', file);
    });
    
    try {
      console.log(`Uploading files to: ${apiUrl}/upload/`);
      await axiosInstance.post(`${apiUrl}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchFiles();
      toast.success('File uploaded successfully!');
    } catch (error: unknown) {
      console.error('Error uploading files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to upload file: ${errorMessage}`);
      toast.error(`Failed to upload file. Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filename: never) => {
    if (!apiUrl) {
      toast.error('API URL is not set');
      return;
    }
    setError(null);
    try {
      await axiosInstance.delete(`${apiUrl}/files/${filename}`);
      await fetchFiles();
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to delete file: ${errorMessage}`);
      toast.error(`Failed to delete file. Error: ${errorMessage}`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (!apiUrl) {
    return <div>Loading API URL...</div>;
  }

  return (
    <div className={"mb-4 w-full"}>
      <Toaster position="top-right" />
      <div {...getRootProps()} style={{ 
        border: '2px dashed #cccccc', 
        padding: '20px', 
        textAlign: 'center',
        opacity: isUploading ? 0.5 : 1,
        pointerEvents: isUploading ? 'none' : 'auto'
      }}>
        <input {...getInputProps()} />
        <p>{isUploading ? 'Uploading...' : 'גרור \'לחלק זה\'  קבצי מסמכים או בחר מתיקיה במחשב'}</p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <>
          <h2 className={"text-orange-600 mt-2 text-xl"}>קבצים שהועלו למערכת</h2>
          <ul role={"list"} className={"text-black my-2 divide-y divide-gray-300"}>
            {files.map(file => (
              <li key={file} className={"flex justify-between gap-x-6 py-1"}>
                <span className={"flex-1"}>{file}</span>
                <button onClick={(e) => { e.preventDefault(); deleteFile(file) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                      stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No files uploaded yet.</p>
      )}
      <p className="text-sm text-gray-500 mt-4">Current API URL: {apiUrl}</p>
    </div>
  );
};

export default FileUpload;
