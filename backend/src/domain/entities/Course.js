// Entidad Course
class Course {
  constructor(id, title, description, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(title, description) {
    if (!title || title.trim() === '') {
      throw new Error('El título del curso es obligatorio');
    }
    
    return new Course(null, title, description);
  }

  update(title, description) {
    if (!title || title.trim() === '') {
      throw new Error('El título del curso es obligatorio');
    }
    
    this.title = title;
    this.description = description;
    this.updatedAt = new Date();
    
    return this;
  }
}

module.exports = Course;
