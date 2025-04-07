// Caso de uso para obtener un documento por ID
class GetDocumentByIdUseCase {
  constructor(documentRepository) {
    this.documentRepository = documentRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('El ID del documento es obligatorio');
    }

    return await this.documentRepository.findById(id);
  }
}

module.exports = GetDocumentByIdUseCase;
