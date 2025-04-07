// Componente CourseList
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.createCourse(formData);
      setFormData({ title: '', description: '' });
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError('Error al crear el curso. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        await courseService.deleteCourse(id);
        fetchCourses();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Cursos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Curso
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">No hay cursos disponibles</h2>
          <p className="mt-2 text-gray-500">Comienza creando tu primer curso para empezar a estudiar.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center mt-4"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Curso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                  <p className="text-gray-500 mt-1">{course.description || 'Sin descripción'}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Creado el: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-primary-600 hover:text-primary-800 p-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  to={`/courses/${course.id}`}
                  className="btn-outline text-sm"
                >
                  Ver detalles
                </Link>
                <Link
                  to={`/courses/${course.id}/upload`}
                  className="btn-outline text-sm"
                >
                  Subir documentos
                </Link>
                <Link
                  to={`/courses/${course.id}/study-plan`}
                  className="btn-secondary text-sm"
                >
                  Generar plan de estudio
                </Link>
                <Link
                  to={`/courses/${course.id}/exams`}
                  className="btn-outline text-sm"
                >
                  Exámenes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear curso */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Crear Nuevo Curso</h3>
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
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary w-full sm:w-auto sm:ml-3"
                >
                  Crear Curso
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
