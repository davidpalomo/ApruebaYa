// Controlador para exámenes
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Importar casos de uso
const GenerateExamUseCase = require('../../domain/usecases/GenerateExamUseCase');
const TakeExamUseCase = require('../../domain/usecases/TakeExamUseCase');
const SubmitExamResponsesUseCase = require('../../domain/usecases/SubmitExamResponsesUseCase');

// Importar repositorios y servicios
const PrismaCourseRepository = require('../repositories/PrismaCourseRepository');
const PrismaDocumentRepository = require('../repositories/PrismaDocumentRepository');
const PrismaExamRepository = require('../repositories/PrismaExamRepository');
const PrismaQuestionRepository = require('../repositories/PrismaQuestionRepository');
const PrismaExamAttemptRepository = require('../repositories/PrismaExamAttemptRepository');
const PrismaResponseRepository = require('../repositories/PrismaResponseRepository');
const GeminiAIService = require('../services/GeminiAIService');

// Función para validar campos
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Error de validación', 
      errors: errors.array() 
    });
  }
  next();
};

// Crear instancias de repositorios
const courseRepository = new PrismaCourseRepository();
const documentRepository = new PrismaDocumentRepository();
const examRepository = new PrismaExamRepository();
const questionRepository = new PrismaQuestionRepository();
const examAttemptRepository = new PrismaExamAttemptRepository();
const responseRepository = new PrismaResponseRepository();

// Crear instancia del servicio de IA con manejo seguro de errores
let aiService;
try {
  aiService = new GeminiAIService();
} catch (error) {
  console.error('❌ Error al inicializar el servicio de IA:', error);
  // No interrumpir la inicialización del controlador, 
  // los endpoints que requieran IA manejarán el error
}

// Crear instancias de casos de uso
const generateExamUseCase = new GenerateExamUseCase(
  courseRepository,
  documentRepository,
  examRepository,
  questionRepository,
  aiService
);

const takeExamUseCase = new TakeExamUseCase(
  examRepository,
  examAttemptRepository,
  questionRepository,
  responseRepository
);

const submitExamResponsesUseCase = new SubmitExamResponsesUseCase(
  examRepository,
  examAttemptRepository,
  questionRepository,
  responseRepository
);

// Generar un examen
router.post('/generate',
  [
    body('courseId').notEmpty().withMessage('El ID del curso es obligatorio'),
    body('title').notEmpty().withMessage('El título del examen es obligatorio'),
    body('questionCount').isInt({ min: 1 }).withMessage('La cantidad de preguntas debe ser un número entero positivo'),
    body('questionTypes').isArray().withMessage('Los tipos de preguntas deben ser un array'),
    validate
  ],
  async (req, res) => {
    try {
      console.log('Solicitud de generación de examen recibida:', req.body);
      
      // Verificar que el servicio de IA esté disponible
      if (!aiService) {
        throw new Error('El servicio de IA no está disponible. Verifique la configuración del sistema.');
      }
      
      const { courseId, title, description, duration, questionCount, questionTypes } = req.body;
      
      console.log('Verificando disponibilidad de API key:', process.env.GEMINI_API_KEY ? 'Configurada' : 'No configurada');
      
      const exam = await generateExamUseCase.execute(
        courseId,
        title,
        description,
        duration,
        questionCount,
        questionTypes
      );
      
      console.log('Examen generado correctamente:', exam.id);
      res.status(201).json({ exam, status: 'success' });
    } catch (error) {
      console.error('Error detallado al generar examen:', error);
      
      // Crear un mensaje de error genérico sin exponer información sensible
      let errorMessage = 'Error al generar el examen. ';
      
      // Personalizar el mensaje según el tipo de error
      if (error.message.includes('API key') || error.message.includes('Gemini')) {
        errorMessage += 'Error de configuración en el servicio de IA. Contacte al administrador del sistema.';
      } else if (error.message.includes('documento')) {
        errorMessage += 'No se encontraron documentos asociados al curso.';
      } else if (error.message.includes('curso')) {
        errorMessage += 'Curso no encontrado o no válido.';
      } else {
        errorMessage += error.message;
      }
      
      res.status(500).json({ 
        message: 'Error al generar examen', 
        error: errorMessage,
        // Incluir stack solo en desarrollo y sin información sensible
        stack: process.env.NODE_ENV === 'development' ? 
          error.stack?.replace(/API[_-]?[kK]ey[^,;\s]*/, '[API_KEY_REDACTED]') : 
          undefined
      });
    }
  }
);

// Iniciar un intento de examen
router.post('/:examId/take', async (req, res) => {
  try {
    const examId = req.params.examId;
    const examAttempt = await takeExamUseCase.execute(examId);
    res.status(201).json(examAttempt);
  } catch (error) {
    console.error('Error al iniciar intento de examen:', error);
    res.status(500).json({ message: 'Error al iniciar intento de examen', error: error.message });
  }
});

// Enviar respuestas de un examen
router.post('/attempts/:attemptId/submit',
  [
    body('responses').isArray().withMessage('Las respuestas deben ser un array'),
    body('responses.*.questionId').notEmpty().withMessage('El ID de la pregunta es obligatorio'),
    body('responses.*.content').notEmpty().withMessage('El contenido de la respuesta es obligatorio'),
    validate
  ],
  async (req, res) => {
    try {
      const attemptId = req.params.attemptId;
      const { responses } = req.body;
      const result = await submitExamResponsesUseCase.execute(attemptId, responses);
      res.json(result);
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      res.status(500).json({ message: 'Error al enviar respuestas', error: error.message });
    }
  }
);

module.exports = router;
