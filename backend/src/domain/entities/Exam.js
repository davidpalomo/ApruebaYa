// Entidad Exam
class Exam {
  constructor(id, title, description, duration, passingScore, courseId, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.passingScore = passingScore || 60;
    this.courseId = courseId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(title, description, duration, passingScore, courseId) {
    if (!title || title.trim() === '') {
      throw new Error('El título del examen es obligatorio');
    }
    
    if (!courseId) {
      throw new Error('El curso asociado es obligatorio');
    }
    
    return new Exam(null, title, description, duration, passingScore, courseId);
  }

  update(title, description, duration, passingScore) {
    if (!title || title.trim() === '') {
      throw new Error('El título del examen es obligatorio');
    }
    
    this.title = title;
    this.description = description;
    this.duration = duration;
    
    if (passingScore !== undefined && passingScore !== null) {
      this.passingScore = passingScore;
    }
    
    this.updatedAt = new Date();
    
    return this;
  }
}

module.exports = Exam;
