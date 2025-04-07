// Test para el backend - GenerateExamUseCase
const GenerateExamUseCase = require('../../domain/usecases/GenerateExamUseCase');
const Exam = require('../../domain/entities/Exam');
const Question = require('../../domain/entities/Question');

describe('GenerateExamUseCase', () => {
  let mockCourseRepository;
  let mockDocumentRepository;
  let mockExamRepository;
  let mockQuestionRepository;
  let mockAIService;
  let generateExamUseCase;

  beforeEach(() => {
    // Mocks de los repositorios y servicios
    mockCourseRepository = {
      findById: jest.fn()
    };
    
    mockDocumentRepository = {
      findByCourseId: jest.fn()
    };
    
    mockExamRepository = {
      save: jest.fn()
    };
    
    mockQuestionRepository = {
      saveMany: jest.fn()
    };
    
    mockAIService = {
      generateExam: jest.fn()
    };

    // Instancia del caso de uso a probar
    generateExamUseCase = new GenerateExamUseCase(
      mockCourseRepository,
      mockDocumentRepository,
      mockExamRepository,
      mockQuestionRepository,
      mockAIService
    );
  });

  test('debe generar un examen correctamente', async () => {
    // Datos de prueba
    const courseId = '1';
    const title = 'Examen de Prueba';
    const description = 'Descripción del examen';
    const duration = 60;
    const questionCount = 10;
    const questionTypes = ['MULTIPLE_CHOICE', 'TRUE_FALSE'];
    
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
    const mockExamData = {
      questions: [
        {
          content: '¿Cuál es la capital de Francia?',
          type: 'MULTIPLE_CHOICE',
          options: ['Madrid', 'Londres', 'París', 'Berlín'],
          answer: 'París',
          explanation: 'París es la capital de Francia desde hace siglos.'
        },
        {
          content: 'Python es un lenguaje de programación interpretado.',
          type: 'TRUE_FALSE',
          options: ['Verdadero', 'Falso'],
          answer: 'Verdadero',
          explanation: 'Python es un lenguaje interpretado, no compilado.'
        }
      ]
    };
    mockAIService.generateExam.mockResolvedValue(mockExamData);
    
    // Mock de la respuesta del repositorio de exámenes
    const mockExam = new Exam(
      '1',
      title,
      description,
      duration,
      60, // passingScore
      courseId,
      new Date(),
      new Date()
    );
    mockExamRepository.save.mockResolvedValue(mockExam);
    
    // Mock de la respuesta del repositorio de preguntas
    const mockQuestions = [
      new Question(
        '1',
        mockExamData.questions[0].content,
        mockExamData.questions[0].type,
        mockExamData.questions[0].options,
        mockExamData.questions[0].answer,
        mockExamData.questions[0].explanation,
        1, // points
        '1', // examId
        new Date(),
        new Date()
      ),
      new Question(
        '2',
        mockExamData.questions[1].content,
        mockExamData.questions[1].type,
        mockExamData.questions[1].options,
        mockExamData.questions[1].answer,
        mockExamData.questions[1].explanation,
        1, // points
        '1', // examId
        new Date(),
        new Date()
      )
    ];
    mockQuestionRepository.saveMany.mockResolvedValue(mockQuestions);
    
    // Ejecutar el caso de uso
    const result = await generateExamUseCase.execute(
      courseId,
      title,
      description,
      duration,
      questionCount,
      questionTypes
    );
    
    // Verificar que los repositorios y servicios fueron llamados correctamente
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).toHaveBeenCalledWith(courseId);
    expect(mockAIService.generateExam).toHaveBeenCalledWith(
      courseId,
      ['1', '2'],
      questionCount,
      questionTypes
    );
    expect(mockExamRepository.save).toHaveBeenCalled();
    expect(mockQuestionRepository.saveMany).toHaveBeenCalled();
    
    // Verificar el resultado
    expect(result).toHaveProperty('exam', mockExam);
    expect(result).toHaveProperty('questions');
    expect(result.questions).toHaveLength(2);
    expect(result.questions).toEqual(mockQuestions);
  });

  test('debe lanzar error si el curso no existe', async () => {
    // Datos de prueba
    const courseId = '999';
    const title = 'Examen de Prueba';
    const description = 'Descripción del examen';
    const duration = 60;
    const questionCount = 10;
    const questionTypes = ['MULTIPLE_CHOICE', 'TRUE_FALSE'];
    
    // Mock de la respuesta del repositorio de cursos
    mockCourseRepository.findById.mockResolvedValue(null);
    
    // Ejecutar el caso de uso y verificar que lanza error
    await expect(generateExamUseCase.execute(
      courseId,
      title,
      description,
      duration,
      questionCount,
      questionTypes
    ))
      .rejects
      .toThrow(`No se encontró un curso con el ID: ${courseId}`);
    
    // Verificar que solo se llamó al repositorio de cursos
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).not.toHaveBeenCalled();
    expect(mockAIService.generateExam).not.toHaveBeenCalled();
    expect(mockExamRepository.save).not.toHaveBeenCalled();
    expect(mockQuestionRepository.saveMany).not.toHaveBeenCalled();
  });

  test('debe lanzar error si no hay documentos en el curso', async () => {
    // Datos de prueba
    const courseId = '1';
    const title = 'Examen de Prueba';
    const description = 'Descripción del examen';
    const duration = 60;
    const questionCount = 10;
    const questionTypes = ['MULTIPLE_CHOICE', 'TRUE_FALSE'];
    
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
    await expect(generateExamUseCase.execute(
      courseId,
      title,
      description,
      duration,
      questionCount,
      questionTypes
    ))
      .rejects
      .toThrow('El curso no tiene documentos asociados');
    
    // Verificar que se llamaron los repositorios correctos
    expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
    expect(mockDocumentRepository.findByCourseId).toHaveBeenCalledWith(courseId);
    expect(mockAIService.generateExam).not.toHaveBeenCalled();
    expect(mockExamRepository.save).not.toHaveBeenCalled();
    expect(mockQuestionRepository.saveMany).not.toHaveBeenCalled();
  });
});
