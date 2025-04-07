// Adaptador para el repositorio de preguntas usando Prisma
const { PrismaClient } = require('@prisma/client');
const QuestionRepository = require('../../domain/ports/QuestionRepository');
const Question = require('../../domain/entities/Question');

class PrismaQuestionRepository extends QuestionRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const questions = await this.prisma.question.findMany();
    return questions.map(question => this._toDomainEntity(question));
  }

  async findById(id) {
    const question = await this.prisma.question.findUnique({
      where: { id }
    });
    
    if (!question) {
      return null;
    }
    
    return this._toDomainEntity(question);
  }

  async findByExamId(examId) {
    const questions = await this.prisma.question.findMany({
      where: { examId }
    });
    
    return questions.map(question => this._toDomainEntity(question));
  }

  async save(question) {
    const data = {
      content: question.content,
      type: question.type,
      options: question.options ? JSON.stringify(question.options) : null,
      answer: question.answer,
      explanation: question.explanation,
      points: question.points,
      examId: question.examId
    };
    
    const savedQuestion = await this.prisma.question.create({
      data
    });
    
    return this._toDomainEntity(savedQuestion);
  }

  async update(question) {
    const data = {
      content: question.content,
      type: question.type,
      options: question.options ? JSON.stringify(question.options) : null,
      answer: question.answer,
      explanation: question.explanation,
      points: question.points,
      updatedAt: new Date()
    };
    
    const updatedQuestion = await this.prisma.question.update({
      where: { id: question.id },
      data
    });
    
    return this._toDomainEntity(updatedQuestion);
  }

  async delete(id) {
    await this.prisma.question.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbQuestion) {
    // Convertir options de string JSON a array, si existe
    let options = null;
    if (dbQuestion.options) {
      try {
        options = JSON.parse(dbQuestion.options);
      } catch (error) {
        console.error('Error al parsear opciones:', error);
        options = dbQuestion.options; // Mantener el valor original si hay error
      }
    }

    return new Question(
      dbQuestion.id,
      dbQuestion.content,
      dbQuestion.type,
      options,
      dbQuestion.answer,
      dbQuestion.explanation,
      dbQuestion.points,
      dbQuestion.examId,
      dbQuestion.createdAt,
      dbQuestion.updatedAt
    );
  }
}

module.exports = PrismaQuestionRepository;
