// Caso de uso para eliminar un curso
class DeleteCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id) {
    // Validar datos de entrada
    if (!id) {
      throw new Error('El ID del curso es obligatorio');
    }

    // Verificar que el curso existe
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new Error(`No se encontró un curso con el ID: ${id}`);
    }

    // Eliminar del repositorio
    return await this.courseRepository.delete(id);
  }
}

module.exports = DeleteCourseUseCase;
