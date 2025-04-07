// Entidad VectorIndex
class VectorIndex {
  constructor(id, indexPath, documentId, createdAt, updatedAt) {
    this.id = id;
    this.indexPath = indexPath;
    this.documentId = documentId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(indexPath, documentId) {
    if (!indexPath || indexPath.trim() === '') {
      throw new Error('La ruta del índice vectorial es obligatoria');
    }
    
    if (!documentId) {
      throw new Error('El documento asociado es obligatorio');
    }
    
    return new VectorIndex(null, indexPath, documentId);
  }

  update(indexPath) {
    if (!indexPath || indexPath.trim() === '') {
      throw new Error('La ruta del índice vectorial es obligatoria');
    }
    
    this.indexPath = indexPath;
    this.updatedAt = new Date();
    
    return this;
  }
}

module.exports = VectorIndex;
