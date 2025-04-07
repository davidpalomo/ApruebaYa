// Caso de uso para generar un plan de estudio
class GenerateStudyPlanUseCase {
  constructor(courseRepository, documentRepository, sessionRepository, aiService) {
    this.courseRepository = courseRepository;
    this.documentRepository = documentRepository;
    this.sessionRepository = sessionRepository;
    this.aiService = aiService;
  }

  async execute(courseId, duration) {
    // Validar datos de entrada
    if (!courseId) {
      throw new Error('El ID del curso es obligatorio');
    }
    
    if (!duration || duration <= 0) {
      throw new Error('La duración del plan de estudio debe ser mayor a 0');
    }

    // Verificar que el curso existe
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error(`No se encontró un curso con el ID: ${courseId}`);
    }

    // Obtener los documentos del curso
    const documents = await this.documentRepository.findByCourseId(courseId);
    if (!documents || documents.length === 0) {
      throw new Error(`El curso no tiene documentos asociados`);
    }

    // Extraer los IDs de los documentos
    const documentIds = documents.map(doc => doc.id);

    // Generar el plan de estudio utilizando el servicio de IA
    const studyPlan = await this.aiService.generateStudySession(courseId, documentIds, duration);

    // Crear las sesiones de estudio
    const sessions = [];
    
    if (!studyPlan.sessions || !Array.isArray(studyPlan.sessions) || studyPlan.sessions.length === 0) {
      console.warn('El plan de estudio generado no contiene sesiones, usando un plan predeterminado');
      return { course, sessions: [] };
    }
    
    for (const sessionData of studyPlan.sessions) {
      try {
        const Session = require('../entities/Session');
        const session = Session.create(
          sessionData.title,
          sessionData.description,
          new Date(sessionData.startDate),
          sessionData.duration,
          courseId
        );

        const savedSession = await this.sessionRepository.save(session);
        
        // Crear los temas para cada sesión
        if (sessionData.topics && sessionData.topics.length > 0) {
          const PrismaTopicRepository = require('../../infrastructure/repositories/PrismaTopicRepository');
          const topicRepository = new PrismaTopicRepository(); // Usar la implementación concreta
          
          for (const topicData of sessionData.topics) {
            try {
              const Topic = require('../entities/Topic');
              const topic = Topic.create(
                topicData.title,
                topicData.content,
                topicData.priority,
                savedSession.id
              );
              
              // Guardar la referencia al documento si existe
              if (topicData.documentRef && topicData.documentRef.id) {
                topic.documentId = topicData.documentRef.id;
              }
              
              await topicRepository.save(topic);
            } catch (topicError) {
              console.error(`Error al guardar tema "${topicData.title}":`, topicError);
              // Continuamos con el siguiente tema
            }
          }
        }
        
        sessions.push(savedSession);
      } catch (sessionError) {
        console.error(`Error al guardar sesión "${sessionData.title}":`, sessionError);
        // Continuamos con la siguiente sesión
      }
    }

    return {
      course,
      sessions
    };
  }
}

module.exports = GenerateStudyPlanUseCase;
