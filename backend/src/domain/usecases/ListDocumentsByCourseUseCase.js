// Caso de uso para listar documentos por curso
class ListDocumentsByCourseUseCase {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  async execute(courseId) {
    if (!courseId) {
      throw new Error('El ID del curso es obligatorio');
    }

    return await this.documentRepository.findByCourseId(courseId);
  }
}

module.exports = ListDocumentsByCourseUseCase;
