// Adaptador para el repositorio de exámenes usando Prisma
const { PrismaClient } = require('@prisma/client');
const ExamRepository = require('../../domain/ports/ExamRepository');
const Exam = require('../../domain/entities/Exam');

class PrismaExamRepository extends ExamRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const exams = await this.prisma.exam.findMany();
    return exams.map(exam => this._toDomainEntity(exam));
  }

  async findById(id) {
    const exam = await this.prisma.exam.findUnique({
      where: { id }
    });
    
    if (!exam) {
      return null;
    }
    
    return this._toDomainEntity(exam);
  }

  async findByCourseId(courseId) {
    const exams = await this.prisma.exam.findMany({
      where: { courseId }
    });
    
    return exams.map(exam => this._toDomainEntity(exam));
  }

  async save(exam) {
    const data = {
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      passingScore: exam.passingScore,
      courseId: exam.courseId
    };
    
    const savedExam = await this.prisma.exam.create({
      data
    });
    
    return this._toDomainEntity(savedExam);
  }

  async update(exam) {
    const data = {
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      passingScore: exam.passingScore,
      updatedAt: new Date()
    };
    
    const updatedExam = await this.prisma.exam.update({
      where: { id: exam.id },
      data
    });
    
    return this._toDomainEntity(updatedExam);
  }

  async delete(id) {
    await this.prisma.exam.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbExam) {
    return new Exam(
      dbExam.id,
      dbExam.title,
      dbExam.description,
      dbExam.duration,
      dbExam.passingScore,
      dbExam.courseId,
      dbExam.createdAt,
      dbExam.updatedAt
    );
  }
}

module.exports = PrismaExamRepository;
