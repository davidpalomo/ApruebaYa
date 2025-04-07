// Entidad Topic
class Topic {
  constructor(id, title, content, priority, completed, sessionId, createdAt, updatedAt, documentId = null) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.priority = priority || 1;
    this.completed = completed || false;
    this.sessionId = sessionId;
    this.documentId = documentId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(title, content, priority, sessionId, documentId = null) {
    if (!title || title.trim() === '') {
      throw new Error('El título del tema es obligatorio');
    }
    
    if (priority < 1 || priority > 5) {
      throw new Error('La prioridad debe estar entre 1 y 5');
    }
    
    if (!sessionId) {
      throw new Error('El ID de la sesión es obligatorio');
    }
    
    return new Topic(null, title, content, priority, false, sessionId, null, null, documentId);
  }

  update(title, content, priority) {
    if (!title || title.trim() === '') {
      throw new Error('El título del tema es obligatorio');
    }
    
    this.title = title;
    this.content = content;
    
    if (priority !== undefined && priority !== null) {
      // Validar prioridad entre 1 y 5
      this.priority = Math.min(Math.max(priority, 1), 5);
    }
    
    this.updatedAt = new Date();
    
    return this;
  }

  complete() {
    this.completed = true;
    this.updatedAt = new Date();
    return this;
  }

  isCompleted() {
    return this.completed;
  }
}

module.exports = Topic;
