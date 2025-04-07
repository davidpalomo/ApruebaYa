// Caso de uso para actualizar un curso
class UpdateCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id, title, description) {
    // Validar datos de entrada
    if (!id) {
      throw new Error('El ID del curso es obligatorio');
    }
    
    if (!title || title.trim() === '') {
      throw new Error('El título del curso es obligatorio');
    }

    // Obtener el curso existente
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new Error(`No se encontró un curso con el ID: ${id}`);
    }

    // Actualizar la entidad
    course.update(title, description);

    // Guardar en el repositorio
    return await this.courseRepository.update(course);
  }
}

module.exports = UpdateCourseUseCase;
