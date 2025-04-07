// Caso de uso para crear un curso
class CreateCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(title, description) {
    // Validar datos de entrada
    if (!title || title.trim() === '') {
      throw new Error('El título del curso es obligatorio');
    }

    // Crear entidad de curso
    const Course = require('../entities/Course');
    const course = Course.create(title, description);

    // Guardar en el repositorio
    return await this.courseRepository.save(course);
  }
}

module.exports = CreateCourseUseCase;
