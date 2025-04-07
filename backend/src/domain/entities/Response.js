// Entidad Response
class Response {
  constructor(id, content, isCorrect, questionId, attemptId, createdAt, updatedAt) {
    this.id = id;
    this.content = content;
    this.isCorrect = isCorrect;
    this.questionId = questionId;
    this.attemptId = attemptId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(content, questionId, attemptId) {
    if (!content) {
      throw new Error('El contenido de la respuesta es obligatorio');
    }
    
    if (!questionId) {
      throw new Error('La pregunta asociada es obligatoria');
    }
    
    if (!attemptId) {
      throw new Error('El intento de examen asociado es obligatorio');
    }
    
    return new Response(null, content, null, questionId, attemptId);
  }

  setCorrect(isCorrect) {
    this.isCorrect = isCorrect;
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = Response;
