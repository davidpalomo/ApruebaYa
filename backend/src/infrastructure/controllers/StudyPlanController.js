// Controlador para planes de estudio
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Importar casos de uso
const GenerateStudyPlanUseCase = require('../../domain/usecases/GenerateStudyPlanUseCase');
const GetStudyPlanByCourseUseCase = require('../../domain/usecases/GetStudyPlanByCourseUseCase');

// Importar repositorios y servicios
const PrismaCourseRepository = require('../repositories/PrismaCourseRepository');
const PrismaDocumentRepository = require('../repositories/PrismaDocumentRepository');
const PrismaSessionRepository = require('../repositories/PrismaSessionRepository');
const PrismaTopicRepository = require('../repositories/PrismaTopicRepository');
const GeminiAIService = require('../services/GeminiAIService');

// Crear instancias de repositorios y servicios
const courseRepository = new PrismaCourseRepository();
const documentRepository = new PrismaDocumentRepository();
const sessionRepository = new PrismaSessionRepository();
const topicRepository = new PrismaTopicRepository();
const aiService = new GeminiAIService();

// Crear instancias de casos de uso
const generateStudyPlanUseCase = new GenerateStudyPlanUseCase(
  courseRepository,
  documentRepository,
  sessionRepository,
  aiService
);

const getStudyPlanByCourseUseCase = new GetStudyPlanByCourseUseCase(
  courseRepository,
  sessionRepository,
  topicRepository
);

// Middleware para validar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Generar un plan de estudio
router.post('/generate',
  [
    body('courseId').notEmpty().withMessage('El ID del curso es obligatorio'),
    body('duration').isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
    validate
  ],
  async (req, res) => {
    try {
      const { courseId, duration } = req.body;
      const studyPlan = await generateStudyPlanUseCase.execute(courseId, duration);
      res.status(201).json(studyPlan);
    } catch (error) {
      console.error('Error al generar plan de estudio:', error);
      res.status(500).json({ message: 'Error al generar plan de estudio', error: error.message });
    }
  }
);

// Obtener plan de estudio por curso
router.get('/course/:courseId',
  [
    param('courseId').notEmpty().withMessage('El ID del curso es obligatorio'),
    validate
  ],
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const studyPlan = await getStudyPlanByCourseUseCase.execute(courseId);
      
      if (!studyPlan.sessions || studyPlan.sessions.length === 0) {
        return res.status(404).json({ message: 'No se encontró un plan de estudio para este curso' });
      }
      
      res.status(200).json(studyPlan);
    } catch (error) {
      console.error('Error al obtener plan de estudio:', error);
      res.status(500).json({ message: 'Error al obtener plan de estudio', error: error.message });
    }
  }
);

module.exports = router;
