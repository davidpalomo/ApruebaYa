// Entidad Session
class Session {
  constructor(id, title, description, startDate, endDate, duration, completed, courseId, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.duration = duration;
    this.completed = completed || false;
    this.courseId = courseId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(title, description, startDate, duration, courseId) {
    if (!title || title.trim() === '') {
      throw new Error('El título de la sesión es obligatorio');
    }
    
    if (!startDate || !(startDate instanceof Date)) {
      throw new Error('La fecha de inicio debe ser una fecha válida');
    }
    
    if (!courseId) {
      throw new Error('El curso asociado es obligatorio');
    }
    
    return new Session(null, title, description, startDate, null, duration, false, courseId);
  }

  update(title, description, startDate, endDate, duration) {
    if (!title || title.trim() === '') {
      throw new Error('El título de la sesión es obligatorio');
    }
    
    this.title = title;
    this.description = description;
    
    if (startDate instanceof Date) {
      this.startDate = startDate;
    }
    
    if (endDate instanceof Date) {
      this.endDate = endDate;
    }
    
    this.duration = duration;
    this.updatedAt = new Date();
    
    return this;
  }

  complete() {
    this.completed = true;
    this.endDate = new Date();
    this.updatedAt = new Date();
    return this;
  }

  isCompleted() {
    return this.completed;
  }
}

module.exports = Session;
