// Caso de uso para obtener un curso por ID
class GetCourseByIdUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('El ID del curso es obligatorio');
    }

    return await this.courseRepository.findById(id);
  }
}

module.exports = GetCourseByIdUseCase;
