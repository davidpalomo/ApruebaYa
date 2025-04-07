// Componente TakeExam
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const TakeExam = () => {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const startExam = async () => {
      try {
        // En una implementación real, aquí iniciaríamos un intento de examen
        // Por ahora, usamos datos simulados
        const examData = {
          id: examId,
          title: 'Examen de Prueba',
          description: 'Este es un examen de prueba para el curso',
          duration: 60,
          passingScore: 60,
          courseId: '1'
        };
        
        const attemptData = {
          id: '1',
          startTime: new Date(),
          examId: examId
        };
        
        const questionsData = [
          {
            id: '1',
            content: '¿Cuál es la capital de Francia?',
            type: 'MULTIPLE_CHOICE',
            options: ['Madrid', 'Londres', 'París', 'Berlín'],
            points: 1
          },
          {
            id: '2',
            content: 'Python es un lenguaje de programación interpretado.',
            type: 'TRUE_FALSE',
            options: ['Verdadero', 'Falso'],
            points: 1
          },
          {
            id: '3',
            content: '¿Cuál de las siguientes NO es una estructura de datos en Python?',
            type: 'MULTIPLE_CHOICE',
            options: ['Lista', 'Tupla', 'Diccionario', 'Matriz'],
            points: 1
          },
          {
            id: '4',
            content: 'HTML es un lenguaje de programación.',
            type: 'TRUE_FALSE',
            options: ['Verdadero', 'Falso'],
            points: 1
          },
          {
            id: '5',
            content: '¿Qué significa SQL?',
            type: 'MULTIPLE_CHOICE',
            options: ['Structured Query Language', 'Simple Question Language', 'System Quality Level', 'Software Quality License'],
            points: 1
          }
        ];
        
        setExam(examData);
        setAttempt(attemptData);
        setQuestions(questionsData);
        setTimeLeft(examData.duration * 60); // Convertir minutos a segundos
        setLoading(false);
      } catch (err) {
        setError('Error al iniciar el examen. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    startExam();
  }, [examId]);

  // Temporizador para el examen
  useEffect(() => {
    if (!loading && timeLeft !== null) {
      if (timeLeft <= 0) {
        handleSubmitExam();
        return;
      }
      
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    
    // Confirmar envío solo si no es por tiempo agotado
    if (timeLeft > 0) {
      const unansweredCount = questions.length - Object.keys(answers).length;
      if (unansweredCount > 0) {
        const confirm = window.confirm(`Tienes ${unansweredCount} pregunta(s) sin responder. ¿Estás seguro de que deseas enviar el examen?`);
        if (!confirm) return;
      } else {
        const confirm = window.confirm('¿Estás seguro de que deseas enviar el examen?');
        if (!confirm) return;
      }
    }
    
    setSubmitting(true);
    
    try {
      // Preparar las respuestas para enviar
      const responses = Object.keys(answers).map(questionId => ({
        questionId,
        content: answers[questionId]
      }));
      
      // En una implementación real, aquí enviaríamos las respuestas
      // Por ahora, simulamos un resultado
      
      // Simular resultado
      const correctAnswers = {
        '1': 'París',
        '2': 'Verdadero',
        '3': 'Matriz',
        '4': 'Falso',
        '5': 'Structured Query Language'
      };
      
      let correctCount = 0;
      Object.keys(answers).forEach(questionId => {
        if (answers[questionId] === correctAnswers[questionId]) {
          correctCount++;
        }
      });
      
      const score = (correctCount / questions.length) * 100;
      const passed = score >= exam.passingScore;
      
      const resultData = {
        score,
        passed,
        totalPoints: questions.length,
        earnedPoints: correctCount
      };
      
      setResult(resultData);
      setExamCompleted(true);
    } catch (err) {
      setError('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
      setSubmitting(false);
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

  if (examCompleted && result) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card text-center py-8">
          <div className={`mx-auto rounded-full w-24 h-24 flex items-center justify-center ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.passed ? (
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            ) : (
              <ExclamationCircleIcon className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {result.passed ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
          </h2>
          
          <div className="mt-4 text-4xl font-bold">
            <span className={result.passed ? 'text-green-500' : 'text-red-500'}>
              {result.score.toFixed(0)}%
            </span>
          </div>
          
          <p className="mt-2 text-gray-500">
            Respondiste correctamente {result.earnedPoints} de {result.totalPoints} preguntas.
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to={`/exams/${examId}`}
              className="btn-outline"
            >
              Ver Detalles
            </Link>
            <Link
              to={`/courses/${exam.courseId}`}
              className="btn-primary"
            >
              Volver al Curso
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{exam.title}</h1>
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
          <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </h2>
          <div className="text-sm text-gray-500">
            {Object.keys(answers).length} de {questions.length} respondidas
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-800 text-lg mb-4">{currentQuestion.content}</p>
          
          <div className="space-y-2">
            {currentQuestion.type === 'MULTIPLE_CHOICE' ? (
              currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor={`option-${index}`} className="ml-3 block text-gray-700">
                    {option}
                  </label>
                </div>
              ))
            ) : (
              currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor={`option-${index}`} className="ml-3 block text-gray-700">
                    {option}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`btn-outline ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Anterior
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? 'Enviando...' : 'Finalizar Examen'}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Navegación de preguntas</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentQuestionIndex === index
                  ? 'bg-primary-600 text-white'
                  : answers[question.id]
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="btn-secondary"
          >
            {submitting ? 'Enviando...' : 'Finalizar Examen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
