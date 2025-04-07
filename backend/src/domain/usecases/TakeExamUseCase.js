// Caso de uso para realizar un intento de examen
class TakeExamUseCase {
  constructor(examRepository, examAttemptRepository, questionRepository, responseRepository) {
    this.examRepository = examRepository;
    this.examAttemptRepository = examAttemptRepository;
    this.questionRepository = questionRepository;
    this.responseRepository = responseRepository;
  }

  async execute(examId) {
    // Validar datos de entrada
    if (!examId) {
      throw new Error('El ID del examen es obligatorio');
    }

    // Verificar que el examen existe
    const exam = await this.examRepository.findById(examId);
    if (!exam) {
      throw new Error(`No se encontró un examen con el ID: ${examId}`);
    }

    // Obtener las preguntas del examen
    const questions = await this.questionRepository.findByExamId(examId);
    if (!questions || questions.length === 0) {
      throw new Error(`El examen no tiene preguntas asociadas`);
    }

    // Crear un nuevo intento de examen
    const ExamAttempt = require('../entities/ExamAttempt');
    const attempt = ExamAttempt.create(examId);
    
    const savedAttempt = await this.examAttemptRepository.save(attempt);

    return {
      attempt: savedAttempt,
      questions
    };
  }
}

module.exports = TakeExamUseCase;
