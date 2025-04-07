// Componente CourseDetail
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService, documentService } from '../services/api';
import { DocumentTextIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon as DownloadIcon } from '@heroicons/react/24/outline';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await courseService.getCourseById(id);
        setCourse(courseData);
        setFormData({
          title: courseData.title,
          description: courseData.description || '',
        });

        const documentsData = await documentService.getDocumentsByCourse(id);
        setDocuments(documentsData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del curso. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCourse = await courseService.updateCourse(id, formData);
      setCourse(updatedCourse);
      setEditing(false);
    } catch (err) {
      setError('Error al actualizar el curso. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
      try {
        await courseService.deleteCourse(id);
        navigate('/courses');
      } catch (err) {
        setError('Error al eliminar el curso. Por favor, inténtalo de nuevo.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Aviso:</strong>
        <span className="block sm:inline"> No se encontró el curso solicitado.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/courses" className="text-primary-600 hover:text-primary-800 mr-4">
            &larr; Volver a cursos
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editing ? 'Editar Curso' : course.title}
          </h1>
        </div>
        {!editing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditing(true)}
              className="btn-outline flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="card mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="label">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="label">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Detalles del Curso</h2>
          <p className="text-gray-500 mb-4">{course.description || 'Sin descripción'}</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to={`/courses/${id}/upload`} className="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Subir Documento
            </Link>
            <Link to={`/courses/${id}/exams`} className="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exámenes
            </Link>
            <Link to={`/courses/${id}/study-plan`} className="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Plan de Estudio
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Documentos del Curso</h2>
        {documents.length === 0 ? (
          <div className="card text-center py-8">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay documentos</h3>
            <p className="mt-1 text-gray-500">Sube documentos para comenzar a estudiar.</p>
            <Link
              to={`/courses/${id}/upload`}
              className="btn-primary inline-flex items-center mt-4"
            >
              Subir Documento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{doc.fileName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Subido el: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/uploads/${doc.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 p-2"
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
