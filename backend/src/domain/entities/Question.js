// Entidad Question
class Question {
  constructor(id, content, type, options, answer, explanation, points, examId, createdAt, updatedAt) {
    this.id = id;
    this.content = content;
    this.type = type;
    this.options = options;
    this.answer = answer;
    this.explanation = explanation;
    this.points = points || 1;
    this.examId = examId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(content, type, options, answer, explanation, points, examId) {
    if (!content || content.trim() === '') {
      throw new Error('El contenido de la pregunta es obligatorio');
    }
    
    if (!type) {
      throw new Error('El tipo de pregunta es obligatorio');
    }
    
    if (!answer || answer.trim() === '') {
      throw new Error('La respuesta es obligatoria');
    }
    
    if (!examId) {
      throw new Error('El examen asociado es obligatorio');
    }
    
    // Validar que las opciones existan para preguntas de opción múltiple
    if (type === 'MULTIPLE_CHOICE' && (!options || !Array.isArray(options) || options.length < 2)) {
      throw new Error('Las preguntas de opción múltiple deben tener al menos 2 opciones');
    }
    
    return new Question(null, content, type, options, answer, explanation, points, examId);
  }

  update(content, type, options, answer, explanation, points) {
    if (!content || content.trim() === '') {
      throw new Error('El contenido de la pregunta es obligatorio');
    }
    
    if (!type) {
      throw new Error('El tipo de pregunta es obligatorio');
    }
    
    if (!answer || answer.trim() === '') {
      throw new Error('La respuesta es obligatoria');
    }
    
    this.content = content;
    this.type = type;
    this.options = options;
    this.answer = answer;
    this.explanation = explanation;
    
    if (points !== undefined && points !== null) {
      this.points = points;
    }
    
    this.updatedAt = new Date();
    
    return this;
  }

  isCorrect(response) {
    if (this.type === 'MULTIPLE_CHOICE' || this.type === 'TRUE_FALSE') {
      return response.trim().toLowerCase() === this.answer.trim().toLowerCase();
    } else {
      // Para otros tipos de preguntas, podría implementarse una lógica más compleja
      // Por ejemplo, usando IA para evaluar respuestas abiertas
      return response.trim().toLowerCase() === this.answer.trim().toLowerCase();
    }
  }
}

module.exports = Question;
