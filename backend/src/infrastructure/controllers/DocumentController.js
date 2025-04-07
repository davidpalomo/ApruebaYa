// Controlador para documentos
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo PDFs e imágenes
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Solo se permiten PDFs e imágenes.'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  }
});

// Importar casos de uso
const UploadDocumentUseCase = require('../../domain/usecases/UploadDocumentUseCase');
const GetDocumentByIdUseCase = require('../../domain/usecases/GetDocumentByIdUseCase');
const ListDocumentsByCourseUseCase = require('../../domain/usecases/ListDocumentsByCourseUseCase');

// Importar repositorios y servicios
const PrismaDocumentRepository = require('../repositories/PrismaDocumentRepository');
const TesseractOCRService = require('../services/TesseractOCRService');
const GeminiAIService = require('../services/GeminiAIService');

// Crear instancias de repositorios y servicios
const documentRepository = new PrismaDocumentRepository();
const ocrService = new TesseractOCRService();
const aiService = new GeminiAIService();

// Crear instancias de casos de uso
const uploadDocumentUseCase = new UploadDocumentUseCase(documentRepository, ocrService, aiService);
const getDocumentByIdUseCase = new GetDocumentByIdUseCase(documentRepository);
const listDocumentsByCourseUseCase = new ListDocumentsByCourseUseCase(documentRepository);

// Middleware para validar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los documentos de un curso
router.get('/course/:courseId', async (req, res) => {
  try {
    const documents = await listDocumentsByCourseUseCase.execute(req.params.courseId);
    res.json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener documentos', error: error.message });
  }
});

// Obtener un documento por ID
router.get('/:id', async (req, res) => {
  try {
    const document = await getDocumentByIdUseCase.execute(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ message: 'Error al obtener documento', error: error.message });
  }
});

// Subir un nuevo documento
router.post('/',
  upload.single('file'),
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('courseId').notEmpty().withMessage('El curso asociado es obligatorio'),
    validate
  ],
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
      }

      const { title, courseId } = req.body;
      const fileName = req.file.originalname;
      const filePath = req.file.path;
      const fileType = req.file.mimetype;

      const document = await uploadDocumentUseCase.execute(
        title,
        fileName,
        filePath,
        fileType,
        courseId
      );

      res.status(201).json(document);
    } catch (error) {
      console.error('Error al subir documento:', error);
      res.status(500).json({ message: 'Error al subir documento', error: error.message });
    }
  }
);

module.exports = router;
