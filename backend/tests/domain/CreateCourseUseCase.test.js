// Test para el backend - CreateCourseUseCase
const CreateCourseUseCase = require('../../domain/usecases/CreateCourseUseCase');
const Course = require('../../domain/entities/Course');

describe('CreateCourseUseCase', () => {
  let mockCourseRepository;
  let createCourseUseCase;

  beforeEach(() => {
    // Mock del repositorio de cursos
    mockCourseRepository = {
      save: jest.fn()
    };

    // Instancia del caso de uso a probar
    createCourseUseCase = new CreateCourseUseCase(mockCourseRepository);
  });

  test('debe crear un curso correctamente', async () => {
    // Datos de prueba
    const title = 'Curso de Prueba';
    const description = 'Descripción del curso de prueba';
    
    // Mock de la respuesta del repositorio
    const mockCourse = new Course(
      '1',
      title,
      description,
      new Date(),
      new Date()
    );
    mockCourseRepository.save.mockResolvedValue(mockCourse);
    
    // Ejecutar el caso de uso
    const result = await createCourseUseCase.execute(title, description);
    
    // Verificar que el repositorio fue llamado correctamente
    expect(mockCourseRepository.save).toHaveBeenCalled();
    
    // Verificar el resultado
    expect(result).toBe(mockCourse);
    expect(result.title).toBe(title);
    expect(result.description).toBe(description);
  });

  test('debe lanzar error si el título está vacío', async () => {
    // Datos de prueba
    const title = '';
    const description = 'Descripción del curso de prueba';
    
    // Ejecutar el caso de uso y verificar que lanza error
    await expect(createCourseUseCase.execute(title, description))
      .rejects
      .toThrow('El título es obligatorio');
    
    // Verificar que el repositorio no fue llamado
    expect(mockCourseRepository.save).not.toHaveBeenCalled();
  });
});
