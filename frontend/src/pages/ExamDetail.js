// Componente ExamDetail
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClockIcon, AcademicCapIcon, CheckIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

const ExamDetail = () => {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // En una implementación real, aquí obtendríamos los datos del examen
    // Por ahora, usamos datos simulados
    const fetchExam = async () => {
      try {
        // Simulación de datos de examen
        setExam({
          id: examId,
          title: 'Examen de Prueba',
          description: 'Este es un examen de prueba para el curso',
          duration: 60,
          passingScore: 60,
          courseId: '1',
          questions: [
            {
              id: '1',
              content: '¿Cuál es la capital de Francia?',
              type: 'MULTIPLE_CHOICE',
              options: ['Madrid', 'Londres', 'París', 'Berlín'],
              answer: 'París',
              explanation: 'París es la capital de Francia desde hace siglos.',
              points: 1
            },
            {
              id: '2',
              content: 'Python es un lenguaje de programación interpretado.',
              type: 'TRUE_FALSE',
              options: ['Verdadero', 'Falso'],
              answer: 'Verdadero',
              explanation: 'Python es un lenguaje interpretado, no compilado.',
              points: 1
            }
          ],
          attempts: []
        });
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del examen. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

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

  if (!exam) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Aviso:</strong>
        <span className="block sm:inline"> No se encontró el examen solicitado.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to={`/courses/${exam.courseId}/exams`} className="text-primary-600 hover:text-primary-800 mr-4">
          &larr; Volver a exámenes
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{exam.title}</h1>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Detalles del Examen</h2>
            <p className="text-gray-500 mb-4">{exam.description || 'Sin descripción'}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
                <span>Duración: {exam.duration} minutos</span>
              </div>
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-1 text-gray-400" />
                <span>Preguntas: {exam.questions.length}</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 mr-1 text-gray-400" />
                <span>Nota mínima: {exam.passingScore}%</span>
              </div>
            </div>
          </div>
          
          <Link
            to={`/exams/${examId}/take`}
            className="btn-primary"
          >
            Realizar Examen
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Historial de Intentos</h2>
        
        {exam.attempts.length === 0 ? (
          <div className="card text-center py-8">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay intentos previos</h3>
            <p className="mt-1 text-gray-500">Realiza este examen para poner a prueba tus conocimientos.</p>
            <Link
              to={`/exams/${examId}/take`}
              className="btn-primary inline-flex items-center mt-4"
            >
              Comenzar Examen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {exam.attempts.map((attempt) => (
              <div key={attempt.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Intento del {new Date(attempt.startTime).toLocaleDateString()}
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>
                        Duración: {Math.round((new Date(attempt.endTime) - new Date(attempt.startTime)) / 60000)} minutos
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center">
                      {attempt.passed ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500 mr-1" />
                      )}
                      <span className={`text-lg font-bold ${attempt.passed ? 'text-green-500' : 'text-red-500'}`}>
                        {attempt.score.toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {attempt.passed ? 'Aprobado' : 'No aprobado'}
                    </span>
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

export default ExamDetail;
