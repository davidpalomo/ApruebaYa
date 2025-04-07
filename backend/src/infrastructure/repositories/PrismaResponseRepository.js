// Adaptador para el repositorio de respuestas usando Prisma
const { PrismaClient } = require('@prisma/client');
const ResponseRepository = require('../../domain/ports/ResponseRepository');
const Response = require('../../domain/entities/Response');

class PrismaResponseRepository extends ResponseRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const responses = await this.prisma.response.findMany();
    return responses.map(response => this._toDomainEntity(response));
  }

  async findById(id) {
    const response = await this.prisma.response.findUnique({
      where: { id }
    });
    
    if (!response) {
      return null;
    }
    
    return this._toDomainEntity(response);
  }

  async findByAttemptId(attemptId) {
    const responses = await this.prisma.response.findMany({
      where: { attemptId }
    });
    
    return responses.map(response => this._toDomainEntity(response));
  }

  async findByQuestionId(questionId) {
    const responses = await this.prisma.response.findMany({
      where: { questionId }
    });
    
    return responses.map(response => this._toDomainEntity(response));
  }

  async save(response) {
    const data = {
      content: response.content,
      isCorrect: response.isCorrect,
      questionId: response.questionId,
      attemptId: response.attemptId
    };
    
    const savedResponse = await this.prisma.response.create({
      data
    });
    
    return this._toDomainEntity(savedResponse);
  }

  async update(response) {
    const data = {
      content: response.content,
      isCorrect: response.isCorrect,
      updatedAt: new Date()
    };
    
    const updatedResponse = await this.prisma.response.update({
      where: { id: response.id },
      data
    });
    
    return this._toDomainEntity(updatedResponse);
  }

  async delete(id) {
    await this.prisma.response.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbResponse) {
    return new Response(
      dbResponse.id,
      dbResponse.content,
      dbResponse.isCorrect,
      dbResponse.questionId,
      dbResponse.attemptId,
      dbResponse.createdAt,
      dbResponse.updatedAt
    );
  }
}

module.exports = PrismaResponseRepository;
