// Servicio para comunicarse con la API
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Configuración de Axios con interceptores para manejo de errores
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de red o del servidor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la solicitud API:', error);
    
    if (error.response) {
      // El servidor respondió con un código de estado diferente de 2xx
      console.error('Respuesta del servidor:', error.response.data);
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
    }
    
    return Promise.reject(error);
  }
);

// Servicios para cursos
export const courseService = {
  // Obtener todos los cursos
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw error;
    }
  },

  // Obtener un curso por ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener curso con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo curso
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  },

  // Actualizar un curso
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar curso con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un curso
  deleteCourse: async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar curso con ID ${id}:`, error);
      throw error;
    }
  },
};

// Servicios para documentos
export const documentService = {
  // Obtener documentos por curso
  getDocumentsByCourse: async (courseId) => {
    try {
      const response = await api.get(`/documents/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener documentos del curso ${courseId}:`, error);
      throw error;
    }
  },

  // Obtener un documento por ID
  getDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener documento con ID ${id}:`, error);
      throw error;
    }
  },

  // Subir un documento
  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir documento:', error);
      throw error;
    }
  },
};

// Servicios para planes de estudio
export const studyPlanService = {
  // Generar un plan de estudio
  generateStudyPlan: async (courseId, duration) => {
    try {
      const response = await api.post('/study-plans/generate', { courseId, duration });
      return response.data;
    } catch (error) {
      console.error('Error al generar plan de estudio:', error);
      throw error;
    }
  },
  
  // Obtener plan de estudio existente para un curso
  getStudyPlanByCourse: async (courseId) => {
    try {
      const response = await api.get(`/study-plans/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener plan de estudio para el curso ${courseId}:`, error);
      throw error;
    }
  }
};

// Servicios para exámenes
export const examService = {
  // Generar un examen
  generateExam: async (examData) => {
    try {
      const response = await api.post('/exams/generate', examData);
      return response.data;
    } catch (error) {
      console.error('Error al generar examen:', error);
      throw error;
    }
  },

  // Iniciar un intento de examen
  takeExam: async (examId) => {
    try {
      const response = await api.post(`/exams/${examId}/take`);
      return response.data;
    } catch (error) {
      console.error(`Error al iniciar intento de examen ${examId}:`, error);
      throw error;
    }
  },

  // Enviar respuestas de un examen
  submitExamResponses: async (attemptId, responses) => {
    try {
      const response = await api.post(`/exams/attempts/${attemptId}/submit`, { responses });
      return response.data;
    } catch (error) {
      console.error(`Error al enviar respuestas del intento ${attemptId}:`, error);
      throw error;
    }
  },
};

// Crear un objeto para exportar todos los servicios
const apiServices = {
  courseService,
  documentService,
  studyPlanService,
  examService,
};

export default apiServices;
