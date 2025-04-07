// Test para el backend - GenerateStudyPlanUseCase
const GenerateStudyPlanUseCase = require('../../domain/usecases/GenerateStudyPlanUseCase');
const Session = require('../../domain/entities/Session');
const Topic = require('../../domain/entities/Topic');

describe('GenerateStudyPlanUseCase', () => {
  let mockCourseRepository;
  let mockDocumentRepository;
  let mockSessionRepository;
  let mockAIService;
  let generateStudyPlanUseCase;

  beforeEach(() => {
    // Mocks de los repositorios y servicios
    mockCourseRepository = {
      findById: jest.fn()
    };
    
    mockDocumentRepository = {
      findByCourseId: jest.fn()
    };
    
    mockSessionRepository = {
      save: jest.fn()
    };
    
    mockAIService = {
      generateStudySession: jest.fn()
    };

    // Instancia del caso de uso a probar
    generateStudyPlanUseCase = new GenerateStudyPlanUseCase(
      mockCourseRepository,
      mockDocumentRepository,
      mockSessionRepository,
      mockAIService
    );
  });

  test('debe generar un plan de estudio correctamente', async () => {
    // Datos de prueba
    const courseId = '1';
    const duration = 14; // días
    
    // Mock de las respuestas de los repositorios
    const mockCourse = {
      id: courseId,
      title: 'Curso de Prueba',
      description: 'Descripción del curso'
    };
    mockCourseRepository.findById.mockResolvedValue(mockCourse);
    
    const mockDocuments = [
      { id: '1', title: 'Documento 1' },
      { id: '2', title: 'Documento 2' }
    ];
    mockDocumentRepository.findByCourseId.mockResolvedValue(mockDocuments);
    
    // Mock de la respuesta del servicio de IA
    const mockStudyPlan = {
      sessions: [
        {
          title: 'Sesión 1',
          description: 'Descripción de la sesión 1',
          startDate: '2025-04-10T10:00:00Z',
          duration: 60,
          topics: [
            {
              title: 'Tema 1',
              content: 'Contenido del tema 1',
              priority: 1
            }
          ]
        }
      ]
    };
    mockAIService.generateStudySession.mockResolvedValue(mockStudyPlan);
    
    // Mock de la respuesta del repositorio de sesiones
    const mockSession = new Session(
      '1',
      'Sesión 1',
      'Descripción de la sesión 1',
      new Date('2025-04-10T10:00:00Z'),
      null,
      60,
      false,
      courseId,
      new Date(),
      new Date()
    );
    mockSessionRepository.save.mockResolvedValue(mockSession);
    
    // Ejecutar el caso de uso
    const result = await generateStudyPlanUseCase.execute(courseId, duration);
    
    // Verificar que los repositorios y servicios fueron llamados correctamente
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).toHaveBeenCalledWith(courseId);
    expect(mockAIService.generateStudySession).toHaveBeenCalledWith(
      courseId,
      ['1', '2'],
      duration
    );
    expect(mockSessionRepository.save).toHaveBeenCalled();
    
    // Verificar el resultado
    expect(result).toHaveProperty('course', mockCourse);
    expect(result).toHaveProperty('sessions');
    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0]).toBe(mockSession);
  });

  test('debe lanzar error si el curso no existe', async () => {
    // Datos de prueba
    const courseId = '999';
    const duration = 14;
    
    // Mock de la respuesta del repositorio de cursos
    mockCourseRepository.findById.mockResolvedValue(null);
    
    // Ejecutar el caso de uso y verificar que lanza error
    await expect(generateStudyPlanUseCase.execute(courseId, duration))
      .rejects
      .toThrow(`No se encontró un curso con el ID: ${courseId}`);
    
    // Verificar que solo se llamó al repositorio de cursos
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).not.toHaveBeenCalled();
    expect(mockAIService.generateStudySession).not.toHaveBeenCalled();
    expect(mockSessionRepository.save).not.toHaveBeenCalled();
  });

  test('debe lanzar error si no hay documentos en el curso', async () => {
    // Datos de prueba
    const courseId = '1';
    const duration = 14;
    
    // Mock de las respuestas de los repositorios
    const mockCourse = {
      id: courseId,
      title: 'Curso de Prueba',
      description: 'Descripción del curso'
    };
    mockCourseRepository.findById.mockResolvedValue(mockCourse);
    
    // No hay documentos
    mockDocumentRepository.findByCourseId.mockResolvedValue([]);
    
    // Ejecutar el caso de uso y verificar que lanza error
    await expect(generateStudyPlanUseCase.execute(courseId, duration))
      .rejects
      .toThrow('El curso no tiene documentos asociados');
    
    // Verificar que se llamaron los repositorios correctos
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).toHaveBeenCalledWith(courseId);
    expect(mockAIService.generateStudySession).not.toHaveBeenCalled();
    expect(mockSessionRepository.save).not.toHaveBeenCalled();
  });
});
