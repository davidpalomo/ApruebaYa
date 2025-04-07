// Caso de uso para listar todos los cursos
class ListCoursesUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute() {
    return await this.courseRepository.findAll();
  }
}

module.exports = ListCoursesUseCase;
