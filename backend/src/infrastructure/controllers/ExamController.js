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

// Crear instancias de repositorios y servicios
const courseRepository = new PrismaCourseRepository();
const documentRepository = new PrismaDocumentRepository();
const examRepository = new PrismaExamRepository();
const questionRepository = new PrismaQuestionRepository();
const examAttemptRepository = new PrismaExamAttemptRepository();
const responseRepository = new PrismaResponseRepository();
const aiService = new GeminiAIService();

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

// Middleware para validar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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
      const { courseId, title, description, duration, questionCount, questionTypes } = req.body;
      const exam = await generateExamUseCase.execute(
        courseId,
        title,
        description,
        duration,
        questionCount,
        questionTypes
      );
      res.status(201).json(exam);
    } catch (error) {
      console.error('Error al generar examen:', error);
      res.status(500).json({ message: 'Error al generar examen', error: error.message });
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
