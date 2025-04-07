// Entidad ExamAttempt
class ExamAttempt {
  constructor(id, startTime, endTime, score, passed, examId, createdAt, updatedAt) {
    this.id = id;
    this.startTime = startTime || new Date();
    this.endTime = endTime;
    this.score = score;
    this.passed = passed;
    this.examId = examId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(examId) {
    if (!examId) {
      throw new Error('El examen asociado es obligatorio');
    }
    
    return new ExamAttempt(null, new Date(), null, null, null, examId);
  }

  complete(score, passingScore) {
    this.endTime = new Date();
    this.score = score;
    this.passed = score >= passingScore;
    this.updatedAt = new Date();
    
    return this;
  }

  isCompleted() {
    return this.endTime !== null;
  }

  getDuration() {
    if (!this.endTime) {
      return null;
    }
    
    return Math.floor((this.endTime - this.startTime) / 1000 / 60); // Duración en minutos
  }
}

module.exports = ExamAttempt;
