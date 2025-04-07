// Caso de uso para obtener un plan de estudio por curso
class GetStudyPlanByCourseUseCase {
  constructor(courseRepository, sessionRepository, topicRepository) {
    this.courseRepository = courseRepository;
    this.sessionRepository = sessionRepository;
    this.topicRepository = topicRepository;
  }

  async execute(courseId) {
    // Validar datos de entrada
    if (!courseId) {
      throw new Error('El ID del curso es obligatorio');
    }

    // Verificar que el curso existe
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error(`No se encontró un curso con el ID: ${courseId}`);
    }

    // Obtener las sesiones del curso
    const sessions = await this.sessionRepository.findByCourseId(courseId);
    
    // Si no hay sesiones, retornar objeto vacío
    if (!sessions || sessions.length === 0) {
      return {
        course,
        sessions: []
      };
    }
    
    // Para cada sesión, obtener sus temas
    const sessionsWithTopics = await Promise.all(sessions.map(async (session) => {
      const topics = await this.topicRepository.findBySessionId(session.id);
      
      // Para cada tema, obtener información del documento si existe
      const topicsWithDocumentRef = await Promise.all(topics.map(async (topic) => {
        if (topic.documentId) {
          try {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            
            const document = await prisma.document.findUnique({
              where: {
                id: topic.documentId
              },
              select: {
                id: true,
                title: true,
                fileName: true
              }
            });
            
            await prisma.$disconnect();
            
            if (document) {
              return {
                ...topic,
                documentRef: {
                  id: document.id,
                  title: document.title,
                  fileName: document.fileName
                }
              };
            }
          } catch (error) {
            console.error(`Error al obtener documento para el tema ${topic.id}:`, error);
          }
        }
        
        return topic;
      }));
      
      return {
        ...session,
        topics: topicsWithDocumentRef
      };
    }));

    return {
      course,
      sessions: sessionsWithTopics
    };
  }
}

module.exports = GetStudyPlanByCourseUseCase; 