// Adaptador para el repositorio de intentos de examen usando Prisma
const { PrismaClient } = require('@prisma/client');
const ExamAttemptRepository = require('../../domain/ports/ExamAttemptRepository');
const ExamAttempt = require('../../domain/entities/ExamAttempt');

class PrismaExamAttemptRepository extends ExamAttemptRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const examAttempts = await this.prisma.examAttempt.findMany();
    return examAttempts.map(attempt => this._toDomainEntity(attempt));
  }

  async findById(id) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id }
    });
    
    if (!attempt) {
      return null;
    }
    
    return this._toDomainEntity(attempt);
  }

  async findByExamId(examId) {
    const attempts = await this.prisma.examAttempt.findMany({
      where: { examId }
    });
    
    return attempts.map(attempt => this._toDomainEntity(attempt));
  }

  async save(attempt) {
    const data = {
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      score: attempt.score,
      passed: attempt.passed,
      examId: attempt.examId
    };
    
    const savedAttempt = await this.prisma.examAttempt.create({
      data
    });
    
    return this._toDomainEntity(savedAttempt);
  }

  async update(attempt) {
    const data = {
      endTime: attempt.endTime,
      score: attempt.score,
      passed: attempt.passed,
      updatedAt: new Date()
    };
    
    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attempt.id },
      data
    });
    
    return this._toDomainEntity(updatedAttempt);
  }

  async delete(id) {
    await this.prisma.examAttempt.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbAttempt) {
    return new ExamAttempt(
      dbAttempt.id,
      dbAttempt.startTime,
      dbAttempt.endTime,
      dbAttempt.score,
      dbAttempt.passed,
      dbAttempt.examId,
      dbAttempt.createdAt,
      dbAttempt.updatedAt
    );
  }
}

module.exports = PrismaExamAttemptRepository;
