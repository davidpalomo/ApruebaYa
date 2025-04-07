// Adaptador para el repositorio de cursos usando Prisma
const { PrismaClient } = require('@prisma/client');
const CourseRepository = require('../../domain/ports/CourseRepository');
const Course = require('../../domain/entities/Course');

class PrismaCourseRepository extends CourseRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const courses = await this.prisma.course.findMany();
    return courses.map(course => this._toDomainEntity(course));
  }

  async findById(id) {
    const course = await this.prisma.course.findUnique({
      where: { id }
    });
    
    if (!course) {
      return null;
    }
    
    return this._toDomainEntity(course);
  }

  async save(course) {
    const data = {
      title: course.title,
      description: course.description
    };
    
    const savedCourse = await this.prisma.course.create({
      data
    });
    
    return this._toDomainEntity(savedCourse);
  }

  async update(course) {
    const data = {
      title: course.title,
      description: course.description,
      updatedAt: new Date()
    };
    
    const updatedCourse = await this.prisma.course.update({
      where: { id: course.id },
      data
    });
    
    return this._toDomainEntity(updatedCourse);
  }

  async delete(id) {
    await this.prisma.course.delete({
      where: { id }
    });
    
    return true;
  }

  _toDomainEntity(dbCourse) {
    return new Course(
      dbCourse.id,
      dbCourse.title,
      dbCourse.description,
      dbCourse.createdAt,
      dbCourse.updatedAt
    );
  }
}

module.exports = PrismaCourseRepository;
