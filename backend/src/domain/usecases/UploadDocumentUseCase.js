// Caso de uso para subir un documento
class UploadDocumentUseCase {
  constructor(documentRepository, ocrService, aiService) {
    this.documentRepository = documentRepository;
    this.ocrService = ocrService;
    this.aiService = aiService;
  }

  async execute(title, fileName, filePath, fileType, courseId) {
    // Validar datos de entrada
    if (!title || title.trim() === '') {
      throw new Error('El título del documento es obligatorio');
    }
    
    if (!fileName || fileName.trim() === '') {
      throw new Error('El nombre del archivo es obligatorio');
    }
    
    if (!filePath || filePath.trim() === '') {
      throw new Error('La ruta del archivo es obligatoria');
    }
    
    if (!courseId) {
      throw new Error('El curso asociado es obligatorio');
    }

    // Procesar el documento con OCR si es necesario
    let content = '';
    if (fileType === 'application/pdf') {
      content = await this.ocrService.extractTextFromPDF(filePath);
    } else if (fileType.startsWith('image/')) {
      content = await this.ocrService.extractTextFromImage(filePath);
    }

    // Crear entidad de documento
    const Document = require('../entities/Document');
    const document = Document.create(title, fileName, filePath, fileType, content, courseId);

    // Guardar en el repositorio
    const savedDocument = await this.documentRepository.save(document);

    // Indexar el documento para el motor RAG (asíncrono)
    this.aiService.indexDocument(savedDocument).catch(error => {
      console.error('Error al indexar el documento:', error);
    });

    return savedDocument;
  }
}

module.exports = UploadDocumentUseCase;
