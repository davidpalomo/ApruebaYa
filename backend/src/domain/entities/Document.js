// Entidad Document
class Document {
  constructor(id, title, fileName, filePath, fileType, content, courseId, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.fileName = fileName;
    this.filePath = filePath;
    this.fileType = fileType;
    this.content = content;
    this.courseId = courseId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(title, fileName, filePath, fileType, content, courseId) {
    if (!title || title.trim() === '') {
      throw new Error('El título del documento es obligatorio');
    }
    
    if (!fileName || fileName.trim() === '') {
      throw new Error('El nombre del archivo es obligatorio');
    }
    
    if (!filePath || filePath.trim() === '') {
      throw new Error('La ruta del archivo es obligatoria');
    }
    
    if (!courseId) {
      throw new Error('El curso asociado es obligatorio');
    }
    
    return new Document(null, title, fileName, filePath, fileType, content, courseId);
  }

  update(title, content) {
    if (!title || title.trim() === '') {
      throw new Error('El título del documento es obligatorio');
    }
    
    this.title = title;
    this.content = content;
    this.updatedAt = new Date();
    
    return this;
  }

  setContent(content) {
    this.content = content;
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = Document;
