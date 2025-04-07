// Adaptador para el repositorio de temas usando Prisma
const { PrismaClient } = require('@prisma/client');
const TopicRepository = require('../../domain/ports/TopicRepository');
const Topic = require('../../domain/entities/Topic');

class PrismaTopicRepository extends TopicRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const topics = await this.prisma.topic.findMany();
    return topics.map(topic => this._toDomainEntity(topic));
  }

  async findById(id) {
    const topic = await this.prisma.topic.findUnique({
      where: { id }
    });
    
    if (!topic) {
      return null;
    }
    
    return this._toDomainEntity(topic);
  }

  async findBySessionId(sessionId) {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      const topics = await prisma.topic.findMany({
        where: {
          sessionId: sessionId
        },
        orderBy: {
          priority: 'asc'
        }
      });
      
      await prisma.$disconnect();
      return topics;
    } catch (error) {
      await prisma.$disconnect();
      throw new Error(`Error al buscar temas por sesión: ${error.message}`);
    }
  }

  async save(topic) {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      // Datos a persistir
      const topicData = {
        title: topic.title,
        content: topic.content,
        priority: topic.priority,
        completed: topic.completed,
        sessionId: topic.sessionId,
      };
      
      // Agregar documentId si existe
      if (topic.documentId) {
        topicData.documentId = topic.documentId;
      }

      let savedTopic;
      
      if (topic.id) {
        // Actualizar topic existente
        savedTopic = await prisma.topic.update({
          where: { id: topic.id },
          data: {
            ...topicData,
            updatedAt: new Date()
          }
        });
      } else {
        // Crear nuevo topic
        savedTopic = await prisma.topic.create({
          data: topicData
        });
      }
      
      await prisma.$disconnect();
      
      return savedTopic;
    } catch (error) {
      await prisma.$disconnect();
      throw new Error(`Error al guardar el tema: ${error.message}`);
    }
  }

  async update(topic) {
    const data = {
      title: topic.title,
      content: topic.content,
      priority: topic.priority,
      updatedAt: new Date()
    };
    
    const updatedTopic = await this.prisma.topic.update({
      where: { id: topic.id },
      data
    });
    
    return this._toDomainEntity(updatedTopic);
  }

  async delete(id) {
    await this.prisma.topic.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbTopic) {
    return new Topic(
      dbTopic.id,
      dbTopic.title,
      dbTopic.content,
      dbTopic.priority,
      false,
      dbTopic.sessionId,
      dbTopic.createdAt,
      dbTopic.updatedAt
    );
  }
}

module.exports = PrismaTopicRepository;
