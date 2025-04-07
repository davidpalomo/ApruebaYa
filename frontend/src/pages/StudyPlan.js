// Componente StudyPlan
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService, documentService, studyPlanService } from '../services/api';
import { ClockIcon, CalendarIcon, ExclamationCircleIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const StudyPlan = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(14); // Duración en días por defecto
  const [expandedTopic, setExpandedTopic] = useState(null); // Para seguimiento del tema expandido
  const [expandedSession, setExpandedSession] = useState(null); // Para seguimiento de la sesión expandida

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        const documentsData = await documentService.getDocumentsByCourse(courseId);
        setDocuments(documentsData);
        
        // Intentar cargar el plan de estudio existente
        try {
          const existingPlan = await studyPlanService.getStudyPlanByCourse(courseId);
          if (existingPlan && existingPlan.sessions && existingPlan.sessions.length > 0) {
            setStudyPlan(existingPlan);
            console.log('Plan de estudio cargado:', existingPlan);
          }
        } catch (planError) {
          console.log('No hay plan de estudio existente para este curso');
          // No establecemos error aquí porque es normal que no exista un plan
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del curso. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleGenerateStudyPlan = async () => {
    if (documents.length === 0) {
      setError('No hay documentos disponibles para generar un plan de estudio. Por favor, sube al menos un documento.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const plan = await studyPlanService.generateStudyPlan(courseId, duration);
      
      // Verificar que el plan tenga la estructura esperada antes de actualizar el estado
      if (!plan || typeof plan !== 'object') {
        throw new Error('La respuesta del servidor no contiene un plan de estudio válido');
      }
      
      // Asegurarnos de que sessions exista, si no existe, inicializarlo como un array vacío
      if (!plan.sessions || !Array.isArray(plan.sessions)) {
        plan.sessions = [];
      }
      
      setStudyPlan(plan);
      setGenerating(false);
    } catch (err) {
      console.error('Error al generar el plan de estudio:', err);
      setError(`Error al generar el plan de estudio: ${err.message || 'Por favor, inténtalo de nuevo.'}`);
      setGenerating(false);
    }
  };
  
  // Función para expandir/colapsar una sesión completa
  const toggleSession = (sessionIndex) => {
    if (expandedSession === sessionIndex) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionIndex);
    }
  };

  // Función para expandir/colapsar un tema específico
  const toggleTopic = (sessionIndex, topicIndex) => {
    const topicKey = `${sessionIndex}-${topicIndex}`;
    if (expandedTopic === topicKey) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicKey);
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
      <div className="flex items-center mb-6">
        <Link to={`/courses/${courseId}`} className="text-primary-600 hover:text-primary-800 mr-4">
          &larr; Volver al curso
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Plan de Estudio</h1>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {studyPlan && studyPlan.sessions && studyPlan.sessions.length > 0 
            ? 'Plan de Estudio Existente' 
            : `Generar Plan de Estudio para ${course.title}`}
        </h2>
        
        {documents.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-yellow-700">
                  No hay documentos disponibles para generar un plan de estudio. Por favor, sube al menos un documento.
                </p>
                <Link to={`/courses/${courseId}/upload`} className="text-sm font-medium text-yellow-700 underline mt-1 inline-block">
                  Subir documento
                </Link>
              </div>
            </div>
          </div>
        ) : studyPlan && studyPlan.sessions && studyPlan.sessions.length > 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-700">
                  Ya existe un plan de estudio para este curso con {studyPlan.sessions.length} sesiones.
                </p>
                <button
                  onClick={() => setStudyPlan(null)}
                  className="text-sm font-medium text-blue-700 underline mt-1 inline-block mr-4"
                >
                  Generar un nuevo plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="duration" className="label">Duración del plan (días)</label>
              <input
                type="number"
                id="duration"
                min="1"
                max="90"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input-field w-32"
              />
            </div>
            
            <button
              onClick={handleGenerateStudyPlan}
              disabled={generating}
              className="btn-primary"
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                'Generar Plan de Estudio'
              )}
            </button>
          </>
        )}
      </div>

      {studyPlan && studyPlan.sessions && Array.isArray(studyPlan.sessions) && studyPlan.sessions.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tu Plan de Estudio Personalizado</h2>
          
          <div className="space-y-6">
            {studyPlan.sessions.map((session, sessionIndex) => (
              <div key={sessionIndex} className="card hover:shadow-lg transition-shadow duration-200">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleSession(sessionIndex)}
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.title || 'Sesión sin título'}</h3>
                    <p className="text-gray-500 mt-1">{session.description || 'Sin descripción'}</p>
                    
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{session.startDate ? new Date(session.startDate).toLocaleDateString() : 'Fecha no definida'}</span>
                      <ClockIcon className="h-4 w-4 ml-4 mr-1" />
                      <span>{session.duration || 0} minutos</span>
                    </div>
                  </div>
                  <div>
                    {expandedSession === sessionIndex ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                {expandedSession === sessionIndex && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Temas a estudiar:</h4>
                    <ul className="space-y-4">
                      {session.topics && Array.isArray(session.topics) && session.topics.length > 0 ? (
                        session.topics.map((topic, topicIndex) => {
                          const topicKey = `${sessionIndex}-${topicIndex}`;
                          const isExpanded = expandedTopic === topicKey;
                          
                          return (
                            <li key={topicIndex} className="bg-gray-50 rounded-lg p-4">
                              <div 
                                className="flex items-start cursor-pointer"
                                onClick={() => toggleTopic(sessionIndex, topicIndex)}
                              >
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                  (topic.priority > 3) ? 'bg-red-100 text-red-600' : 
                                  (topic.priority > 1) ? 'bg-yellow-100 text-yellow-600' : 
                                  'bg-green-100 text-green-600'
                                }`}>
                                  <span className="text-xs font-bold">{topic.priority || 1}</span>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900">{topic.title || 'Tema sin título'}</p>
                                    {isExpanded ? (
                                      <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  {!isExpanded && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                      {topic.content ? `${topic.content.substring(0, 150)}...` : 'Sin contenido'}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {isExpanded && (
                                <div className="mt-4 pl-7">
                                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="prose prose-sm max-w-none">
                                      {topic.content.split('\n').map((paragraph, i) => (
                                        paragraph.trim() ? <p key={i} className="mb-2">{paragraph}</p> : null
                                      ))}
                                    </div>
                                    
                                    {topic.documentRef && (
                                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-xs text-blue-600">
                                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                                        <span>
                                          Material de referencia: {topic.documentRef.title || 'Documento sin título'}
                                          {topic.documentRef.fileName && <span className="italic"> ({topic.documentRef.fileName})</span>}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-sm text-gray-500">No hay temas definidos para esta sesión.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : studyPlan ? (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-yellow-700">
                Se generó un plan de estudios, pero no incluye sesiones. Por favor, intenta generar el plan nuevamente.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudyPlan;
