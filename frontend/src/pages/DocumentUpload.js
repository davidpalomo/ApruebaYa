// Componente DocumentUpload
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { documentService } from '../services/api';
import axios from 'axios';
import { ArrowUpTrayIcon as UploadIcon, DocumentTextIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

const DocumentUpload = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Tamaño máximo del archivo en bytes (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`El archivo es demasiado grande. El tamaño máximo permitido es 5MB. El archivo seleccionado es de ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }
      
      setError(null);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Si no hay título, usar el nombre del archivo como título por defecto
      if (!title) {
        // Eliminar la extensión del archivo para el título
        const titleFromFileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(titleFromFileName);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        setError(`El archivo es demasiado grande. El tamaño máximo permitido es 5MB. El archivo seleccionado es de ${(droppedFile.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }
      
      setError(null);
      setFile(droppedFile);
      setFileName(droppedFile.name);
      // Si no hay título, usar el nombre del archivo como título por defecto
      if (!title) {
        // Eliminar la extensión del archivo para el título
        const titleFromFileName = droppedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(titleFromFileName);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecciona un archivo para subir.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`El archivo es demasiado grande. El tamaño máximo permitido es 5MB. Tu archivo es de ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
      return;
    }

    if (!title.trim()) {
      setError('Por favor, ingresa un título para el documento.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('courseId', courseId);
      formData.append('file', file);

      // Usar directamente la URL del backend en lugar de pasar por el proxy de Vercel
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'http://apruebaya-backend-prod.eba-shidhbqx.us-east-1.elasticbeanstalk.com/api/documents'
        : 'http://localhost:3001/api/documents';
        
      await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Redirigir al detalle del curso después de una breve pausa
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(`Error al subir el documento: ${err.message || 'Por favor, inténtalo de nuevo con un archivo más pequeño.'}`);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to={`/courses/${courseId}`} className="text-primary-600 hover:text-primary-800 mr-4">
          &larr; Volver al curso
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Subir Documento</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="label">Título del documento</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Ingresa un título descriptivo"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label">Archivo</label>
            <div
              className={`border-2 border-dashed rounded-md p-6 ${
                file ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              } transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="text-center">
                  <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Arrastra y suelta un archivo aquí, o{' '}
                    <label className="text-primary-600 hover:text-primary-800 cursor-pointer">
                      <span>selecciona un archivo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PDF, Word, TXT o imágenes (máx. 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fileName}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo...
                </>
              ) : (
                <>
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Subir Documento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
