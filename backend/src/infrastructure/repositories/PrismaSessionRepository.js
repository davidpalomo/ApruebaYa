// Adaptador para el repositorio de sesiones usando Prisma
const { PrismaClient } = require('@prisma/client');
const SessionRepository = require('../../domain/ports/SessionRepository');
const Session = require('../../domain/entities/Session');

class PrismaSessionRepository extends SessionRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const sessions = await this.prisma.session.findMany();
    return sessions.map(session => this._toDomainEntity(session));
  }

  async findById(id) {
    const session = await this.prisma.session.findUnique({
      where: { id }
    });
    
    if (!session) {
      return null;
    }
    
    return this._toDomainEntity(session);
  }

  async findByCourseId(courseId) {
    const sessions = await this.prisma.session.findMany({
      where: { courseId }
    });
    
    return sessions.map(session => this._toDomainEntity(session));
  }

  async save(session) {
    const data = {
      title: session.title,
      description: session.description,
      startDate: session.startDate,
      duration: session.duration,
      courseId: session.courseId
    };
    
    const savedSession = await this.prisma.session.create({
      data
    });
    
    return this._toDomainEntity(savedSession);
  }

  async update(session) {
    const data = {
      title: session.title,
      description: session.description,
      startDate: session.startDate,
      duration: session.duration,
      updatedAt: new Date()
    };
    
    const updatedSession = await this.prisma.session.update({
      where: { id: session.id },
      data
    });
    
    return this._toDomainEntity(updatedSession);
  }

  async delete(id) {
    await this.prisma.session.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbSession) {
    return new Session(
      dbSession.id,
      dbSession.title,
      dbSession.description,
      dbSession.startDate,
      dbSession.endDate,
      dbSession.duration,
      dbSession.completed,
      dbSession.courseId,
      dbSession.createdAt,
      dbSession.updatedAt
    );
  }
}

module.exports = PrismaSessionRepository;
