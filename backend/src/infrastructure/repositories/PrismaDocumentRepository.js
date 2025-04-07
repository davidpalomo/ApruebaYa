// Adaptador para el repositorio de documentos usando Prisma
const { PrismaClient } = require('@prisma/client');
const DocumentRepository = require('../../domain/ports/DocumentRepository');
const Document = require('../../domain/entities/Document');

class PrismaDocumentRepository extends DocumentRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const documents = await this.prisma.document.findMany();
    return documents.map(document => this._toDomainEntity(document));
  }

  async findById(id) {
    const document = await this.prisma.document.findUnique({
      where: { id }
    });
    
    if (!document) {
      return null;
    }
    
    return this._toDomainEntity(document);
  }

  async findByCourseId(courseId) {
    const documents = await this.prisma.document.findMany({
      where: { courseId }
    });
    
    return documents.map(document => this._toDomainEntity(document));
  }

  async save(document) {
    const data = {
      title: document.title,
      fileName: document.fileName,
      filePath: document.filePath,
      fileType: document.fileType,
      content: document.content,
      courseId: document.courseId
    };
    
    const savedDocument = await this.prisma.document.create({
      data
    });
    
    return this._toDomainEntity(savedDocument);
  }

  async update(document) {
    const data = {
      title: document.title,
      content: document.content,
      updatedAt: new Date()
    };
    
    const updatedDocument = await this.prisma.document.update({
      where: { id: document.id },
      data
    });
    
    return this._toDomainEntity(updatedDocument);
  }

  async delete(id) {
    await this.prisma.document.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbDocument) {
    return new Document(
      dbDocument.id,
      dbDocument.title,
      dbDocument.fileName,
      dbDocument.filePath,
      dbDocument.fileType,
      dbDocument.content,
      dbDocument.courseId,
      dbDocument.createdAt,
      dbDocument.updatedAt
    );
  }
}

module.exports = PrismaDocumentRepository;
