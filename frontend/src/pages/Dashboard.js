// Componente Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { PlusIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchCourses();
  }, []);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link to="/courses" className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No hay cursos disponibles</h2>
          <p className="mt-2 text-gray-500">Comienza creando tu primer curso para empezar a estudiar.</p>
          <Link to="/courses" className="btn-primary inline-flex items-center mt-4">
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Curso
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tus cursos recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                  <BookOpenIcon className="h-6 w-6 text-primary-600" />
                </div>
                <p className="text-gray-500 mb-4 line-clamp-2">{course.description || 'Sin descripción'}</p>
                <div className="flex justify-between mt-4">
                  <Link to={`/courses/${course.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                    Ver detalles
                  </Link>
                  <Link to={`/courses/${course.id}/study-plan`} className="text-secondary-600 hover:text-secondary-800 font-medium">
                    Plan de estudio
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length > 3 && (
            <div className="mt-6 text-center">
              <Link to="/courses" className="btn-outline">
                Ver todos los cursos
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col items-center text-center">
              <DocumentTextIcon className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Subir Documento</h3>
              <p className="text-gray-500 mb-4">Sube tus materiales de estudio para comenzar a aprender.</p>
              <Link to="/courses" className="btn-primary">
                Seleccionar Curso
              </Link>
            </div>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col items-center text-center">
              <AcademicCapIcon className="h-12 w-12 text-secondary-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generar Plan de Estudio</h3>
              <p className="text-gray-500 mb-4">Crea un plan personalizado basado en tus materiales.</p>
              <Link to="/courses" className="btn-secondary">
                Seleccionar Curso
              </Link>
            </div>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col items-center text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Realizar Examen</h3>
              <p className="text-gray-500 mb-4">Pon a prueba tus conocimientos con exámenes generados por IA.</p>
              <Link to="/courses" className="btn-outline">
                Seleccionar Curso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
