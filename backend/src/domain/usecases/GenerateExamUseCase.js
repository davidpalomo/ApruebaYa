// Caso de uso para generar un examen
class GenerateExamUseCase {
  constructor(courseRepository, documentRepository, examRepository, questionRepository, aiService) {
    this.courseRepository = courseRepository;
    this.documentRepository = documentRepository;
    this.examRepository = examRepository;
    this.questionRepository = questionRepository;
    this.aiService = aiService;
  }

  async execute(courseId, title, description, duration, questionCount, questionTypes) {
    // Validar datos de entrada
    if (!courseId) {
      throw new Error('El ID del curso es obligatorio');
    }
    
    if (!title || title.trim() === '') {
      throw new Error('El título del examen es obligatorio');
    }
    
    if (!questionCount || questionCount <= 0) {
      throw new Error('La cantidad de preguntas debe ser mayor a 0');
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

    // Crear el examen
    const Exam = require('../entities/Exam');
    const exam = Exam.create(title, description, duration, 60, courseId); // 60% como nota de aprobación por defecto
    
    const savedExam = await this.examRepository.save(exam);

    // Generar las preguntas utilizando el servicio de IA
    const generatedQuestions = await this.aiService.generateExam(courseId, documentIds, questionCount, questionTypes);

    // Crear las preguntas para el examen
    const questions = [];
    for (const questionData of generatedQuestions) {
      const Question = require('../entities/Question');
      const question = Question.create(
        questionData.content,
        questionData.type,
        questionData.options,
        questionData.answer,
        questionData.explanation,
        questionData.points,
        savedExam.id
      );

      const savedQuestion = await this.questionRepository.save(question);
      questions.push(savedQuestion);
    }

    return {
      exam: savedExam,
      questions
    };
  }
}

module.exports = GenerateExamUseCase;
