// Componente ExamList
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService, examService } from '../services/api';
import { PlusIcon, AcademicCapIcon, ClockIcon, CheckIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

const ExamList = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    questionCount: 10,
    questionTypes: ['MULTIPLE_CHOICE', 'TRUE_FALSE']
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // En una implementación real, aquí obtendríamos los exámenes del curso
        // Por ahora, usamos datos simulados
        setExams([]);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del curso. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        questionTypes: [...formData.questionTypes, value]
      });
    } else {
      setFormData({
        ...formData,
        questionTypes: formData.questionTypes.filter(type => type !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const examData = {
        ...formData,
        courseId,
        questionCount: parseInt(formData.questionCount),
        duration: parseInt(formData.duration)
      };
      
      const result = await examService.generateExam(examData);
      
      // Verificar que la respuesta contiene un examen válido
      if (!result || !result.exam || !result.exam.id) {
        throw new Error('La respuesta del servidor no contiene un examen válido');
      }
      
      // Actualizar la lista de exámenes (en una implementación real)
      // Por ahora, simplemente cerramos el modal
      setShowModal(false);
      
      // Redirigir al examen creado
      window.location.href = `/exams/${result.exam.id}`;
    } catch (err) {
      console.error('Error al generar el examen:', err);
      setError(`Error al generar el examen: ${err.message || 'Por favor, inténtalo de nuevo.'}`);
      setLoading(false);
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Exámenes del curso</h1>
        <div className="flex space-x-4">
          <Link to={`/courses/${courseId}/study-plan`} className="btn-secondary">
            Ver Plan de Estudio
          </Link>
          <Link to={`/courses/${courseId}`} className="btn-secondary">
            Volver al curso
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Examen
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="card text-center py-12">
          <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No hay exámenes disponibles</h2>
          <p className="mt-2 text-gray-500">Crea tu primer examen para poner a prueba tus conocimientos.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center mt-4"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Examen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                  <p className="text-gray-500 mt-1">{exam.description || 'Sin descripción'}</p>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{exam.duration} minutos</span>
                    <span className="mx-2">•</span>
                    <span>{exam.questions.length} preguntas</span>
                    <span className="mx-2">•</span>
                    <span>Nota mínima: {exam.passingScore}%</span>
                  </div>
                </div>
                <div>
                  {exam.attempts && exam.attempts.length > 0 ? (
                    <div className="flex items-center">
                      {exam.attempts[0].passed ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${exam.attempts[0].passed ? 'text-green-500' : 'text-red-500'}`}>
                        {exam.attempts[0].score.toFixed(0)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No intentado</span>
                  )}
                </div>
              </div>
              <div className="flex mt-4">
                <Link
                  to={`/exams/${exam.id}`}
                  className="btn-outline text-sm mr-2"
                >
                  Ver detalles
                </Link>
                <Link
                  to={`/exams/${exam.id}/take`}
                  className="btn-secondary text-sm"
                >
                  Realizar examen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear examen */}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Crear Nuevo Examen</h3>
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
                          rows="2"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="duration" className="label">Duración (minutos)</label>
                          <input
                            type="number"
                            id="duration"
                            name="duration"
                            min="10"
                            max="180"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="questionCount" className="label">Número de preguntas</label>
                          <input
                            type="number"
                            id="questionCount"
                            name="questionCount"
                            min="5"
                            max="50"
                            value={formData.questionCount}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="label">Tipos de preguntas</label>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="multipleChoice"
                              name="questionTypes"
                              value="MULTIPLE_CHOICE"
                              checked={formData.questionTypes.includes('MULTIPLE_CHOICE')}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="multipleChoice" className="ml-2 text-sm text-gray-700">
                              Opción múltiple
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="trueFalse"
                              name="questionTypes"
                              value="TRUE_FALSE"
                              checked={formData.questionTypes.includes('TRUE_FALSE')}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="trueFalse" className="ml-2 text-sm text-gray-700">
                              Verdadero/Falso
                            </label>
                          </div>
                        </div>
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
                  Crear Examen
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

export default ExamList;
