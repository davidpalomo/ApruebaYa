// Caso de uso para enviar respuestas de un examen
class SubmitExamResponsesUseCase {
  constructor(examRepository, examAttemptRepository, questionRepository, responseRepository) {
    this.examRepository = examRepository;
    this.examAttemptRepository = examAttemptRepository;
    this.questionRepository = questionRepository;
    this.responseRepository = responseRepository;
  }

  async execute(attemptId, responses) {
    // Validar datos de entrada
    if (!attemptId) {
      throw new Error('El ID del intento de examen es obligatorio');
    }
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error('Las respuestas son obligatorias');
    }

    // Verificar que el intento de examen existe
    const attempt = await this.examAttemptRepository.findById(attemptId);
    if (!attempt) {
      throw new Error(`No se encontró un intento de examen con el ID: ${attemptId}`);
    }

    // Verificar que el intento no ha sido completado
    if (attempt.isCompleted()) {
      throw new Error('Este intento de examen ya ha sido completado');
    }

    // Obtener el examen
    const exam = await this.examRepository.findById(attempt.examId);
    if (!exam) {
      throw new Error(`No se encontró el examen asociado al intento`);
    }

    // Procesar cada respuesta
    let totalPoints = 0;
    let earnedPoints = 0;
    
    for (const responseData of responses) {
      // Verificar que la pregunta existe
      const question = await this.questionRepository.findById(responseData.questionId);
      if (!question) {
        throw new Error(`No se encontró una pregunta con el ID: ${responseData.questionId}`);
      }
      
      // Verificar que la pregunta pertenece al examen
      if (question.examId !== exam.id) {
        throw new Error(`La pregunta no pertenece al examen actual`);
      }
      
      // Crear la respuesta
      const Response = require('../entities/Response');
      const response = Response.create(
        responseData.content,
        responseData.questionId,
        attemptId
      );
      
      // Evaluar si la respuesta es correcta
      const isCorrect = question.isCorrect(responseData.content);
      response.setCorrect(isCorrect);
      
      // Guardar la respuesta
      await this.responseRepository.save(response);
      
      // Acumular puntos
      totalPoints += question.points;
      if (isCorrect) {
        earnedPoints += question.points;
      }
    }
    
    // Calcular la puntuación final (porcentaje)
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    
    // Completar el intento de examen
    attempt.complete(score, exam.passingScore);
    const updatedAttempt = await this.examAttemptRepository.update(attempt);
    
    return {
      attempt: updatedAttempt,
      score,
      passed: updatedAttempt.passed,
      totalPoints,
      earnedPoints
    };
  }
}

module.exports = SubmitExamResponsesUseCase;
