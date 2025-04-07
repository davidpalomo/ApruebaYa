// Controlador para cursos
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Importar casos de uso
const CreateCourseUseCase = require('../../domain/usecases/CreateCourseUseCase');
const GetCourseByIdUseCase = require('../../domain/usecases/GetCourseByIdUseCase');
const ListCoursesUseCase = require('../../domain/usecases/ListCoursesUseCase');
const UpdateCourseUseCase = require('../../domain/usecases/UpdateCourseUseCase');
const DeleteCourseUseCase = require('../../domain/usecases/DeleteCourseUseCase');

// Importar repositorios
const PrismaCourseRepository = require('../repositories/PrismaCourseRepository');

// Crear instancias de repositorios
const courseRepository = new PrismaCourseRepository();

// Crear instancias de casos de uso
const createCourseUseCase = new CreateCourseUseCase(courseRepository);
const getCourseByIdUseCase = new GetCourseByIdUseCase(courseRepository);
const listCoursesUseCase = new ListCoursesUseCase(courseRepository);
const updateCourseUseCase = new UpdateCourseUseCase(courseRepository);
const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository);

// Middleware para validar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los cursos
router.get('/', async (req, res) => {
  try {
    const courses = await listCoursesUseCase.execute();
    res.json(courses);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ message: 'Error al obtener cursos', error: error.message });
  }
});

// Obtener un curso por ID
router.get('/:id', async (req, res) => {
  try {
    const course = await getCourseByIdUseCase.execute(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ message: 'Error al obtener curso', error: error.message });
  }
});

// Crear un nuevo curso
router.post('/',
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').optional(),
    validate
  ],
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const course = await createCourseUseCase.execute(title, description);
      res.status(201).json(course);
    } catch (error) {
      console.error('Error al crear curso:', error);
      res.status(500).json({ message: 'Error al crear curso', error: error.message });
    }
  }
);

// Actualizar un curso
router.put('/:id',
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').optional(),
    validate
  ],
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const course = await updateCourseUseCase.execute(req.params.id, title, description);
      res.json(course);
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      res.status(500).json({ message: 'Error al actualizar curso', error: error.message });
    }
  }
);

// Eliminar un curso
router.delete('/:id', async (req, res) => {
  try {
    await deleteCourseUseCase.execute(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ message: 'Error al eliminar curso', error: error.message });
  }
});

module.exports = router;
