// Test para el backend - UploadDocumentUseCase
const UploadDocumentUseCase = require('../../domain/usecases/UploadDocumentUseCase');
const Document = require('../../domain/entities/Document');

describe('UploadDocumentUseCase', () => {
  let mockDocumentRepository;
  let mockOCRService;
  let mockAIService;
  let uploadDocumentUseCase;

  beforeEach(() => {
    // Mocks de los repositorios y servicios
    mockDocumentRepository = {
      save: jest.fn()
    };
    
    mockOCRService = {
      processDocument: jest.fn()
    };
    
    mockAIService = {
      indexDocument: jest.fn()
    };

    // Instancia del caso de uso a probar
    uploadDocumentUseCase = new UploadDocumentUseCase(
      mockDocumentRepository,
      mockOCRService,
      mockAIService
    );
  });

  test('debe subir un documento correctamente', async () => {
    // Datos de prueba
    const title = 'Documento de Prueba';
    const fileName = 'test.pdf';
    const filePath = '/path/to/test.pdf';
    const fileType = 'application/pdf';
    const courseId = '1';
    
    // Mock de las respuestas de los servicios
    const extractedContent = 'Contenido extraído del documento';
    mockOCRService.processDocument.mockResolvedValue(extractedContent);
    
    const indexResult = {
      documentId: '1',
      indexPath: '/path/to/index',
      chunkCount: 5
    };
    mockAIService.indexDocument.mockResolvedValue(indexResult);
    
    // Mock de la respuesta del repositorio
    const mockDocument = new Document(
      '1',
      title,
      fileName,
      filePath,
      fileType,
      extractedContent,
      courseId,
      new Date(),
      new Date()
    );
    mockDocumentRepository.save.mockResolvedValue(mockDocument);
    
    // Ejecutar el caso de uso
    const result = await uploadDocumentUseCase.execute(
      title,
      fileName,
      filePath,
      fileType,
      courseId
    );
    
    // Verificar que los servicios y repositorios fueron llamados correctamente
    expect(mockOCRService.processDocument).toHaveBeenCalledWith(filePath);
    expect(mockDocumentRepository.save).toHaveBeenCalled();
    expect(mockAIService.indexDocument).toHaveBeenCalled();
    
    // Verificar el resultado
    expect(result).toBe(mockDocument);
    expect(result.title).toBe(title);
    expect(result.fileName).toBe(fileName);
    expect(result.content).toBe(extractedContent);
  });

  test('debe lanzar error si faltan datos obligatorios', async () => {
    // Datos de prueba incompletos
    const title = 'Documento de Prueba';
    const fileName = 'test.pdf';
    const filePath = '/path/to/test.pdf';
    const fileType = 'application/pdf';
    const courseId = '';
    
    // Ejecutar el caso de uso y verificar que lanza error
    await expect(uploadDocumentUseCase.execute(
      title,
      fileName,
      filePath,
      fileType,
      courseId
    ))
      .rejects
      .toThrow('El ID del curso es obligatorio');
    
    // Verificar que los servicios no fueron llamados
    expect(mockOCRService.processDocument).not.toHaveBeenCalled();
    expect(mockDocumentRepository.save).not.toHaveBeenCalled();
    expect(mockAIService.indexDocument).not.toHaveBeenCalled();
  });
});
