// Adaptador para el repositorio de índices vectoriales usando Prisma
const { PrismaClient } = require('@prisma/client');
const VectorIndexRepository = require('../../domain/ports/VectorIndexRepository');
const VectorIndex = require('../../domain/entities/VectorIndex');

class PrismaVectorIndexRepository extends VectorIndexRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const vectorIndices = await this.prisma.vectorIndex.findMany();
    return vectorIndices.map(index => this._toDomainEntity(index));
  }

  async findById(id) {
    const vectorIndex = await this.prisma.vectorIndex.findUnique({
      where: { id }
    });
    
    if (!vectorIndex) {
      return null;
    }
    
    return this._toDomainEntity(vectorIndex);
  }

  async findByDocumentId(documentId) {
    const vectorIndex = await this.prisma.vectorIndex.findUnique({
      where: { documentId }
    });
    
    if (!vectorIndex) {
      return null;
    }
    
    return this._toDomainEntity(vectorIndex);
  }

  async save(vectorIndex) {
    const data = {
      indexPath: vectorIndex.indexPath,
      documentId: vectorIndex.documentId
    };
    
    const savedVectorIndex = await this.prisma.vectorIndex.create({
      data
    });
    
    return this._toDomainEntity(savedVectorIndex);
  }

  async update(vectorIndex) {
    const data = {
      indexPath: vectorIndex.indexPath,
      updatedAt: new Date()
    };
    
    const updatedVectorIndex = await this.prisma.vectorIndex.update({
      where: { id: vectorIndex.id },
      data
    });
    
    return this._toDomainEntity(updatedVectorIndex);
  }

  async delete(id) {
    await this.prisma.vectorIndex.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbVectorIndex) {
    return new VectorIndex(
      dbVectorIndex.id,
      dbVectorIndex.indexPath,
      dbVectorIndex.documentId,
      dbVectorIndex.createdAt,
      dbVectorIndex.updatedAt
    );
  }
}

module.exports = PrismaVectorIndexRepository;
