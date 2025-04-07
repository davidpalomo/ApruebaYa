// Script para sembrar datos iniciales en la base de datos
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando proceso de sembrado de datos...');

  try {
    // Crear un curso de ejemplo
    const curso1 = await prisma.course.create({
      data: {
        title: 'Introducción a la Programación',
        description: 'Curso básico para aprender los fundamentos de la programación',
      },
    });

    console.log(`Curso creado: ${curso1.title}`);

    // Crear un segundo curso
    const curso2 = await prisma.course.create({
      data: {
        title: 'Matemáticas Avanzadas',
        description: 'Curso de matemáticas para nivel universitario',
      },
    });

    console.log(`Curso creado: ${curso2.title}`);

    // Crear documentos de ejemplo para el primer curso
    const documento1 = await prisma.document.create({
      data: {
        title: 'Fundamentos de Algoritmos',
        fileName: 'algoritmos_basicos.pdf',
        filePath: '/app/uploads/ejemplo_algoritmos.pdf',
        fileType: 'application/pdf',
        content: 'Contenido de ejemplo sobre algoritmos básicos y estructuras de control.',
        courseId: curso1.id,
      },
    });

    console.log(`Documento creado: ${documento1.title}`);

    // Crear una sesión de estudio para el primer curso
    const sesion1 = await prisma.session.create({
      data: {
        title: 'Introducción a Variables y Tipos de Datos',
        description: 'Sesión para aprender los conceptos básicos de variables',
        startDate: new Date(),
        duration: 60, // 60 minutos
        courseId: curso1.id,
      },
    });

    console.log(`Sesión creada: ${sesion1.title}`);

    // Crear temas para la sesión
    const tema1 = await prisma.topic.create({
      data: {
        title: 'Variables y constantes',
        content: 'Las variables son contenedores para almacenar datos que pueden cambiar durante la ejecución del programa.',
        priority: 5,
        sessionId: sesion1.id,
      },
    });

    console.log(`Tema creado: ${tema1.title}`);

    // Crear un examen para el primer curso
    const examen1 = await prisma.exam.create({
      data: {
        title: 'Evaluación de Fundamentos de Programación',
        description: 'Examen para evaluar los conocimientos básicos de programación',
        duration: 90, // 90 minutos
        passingScore: 70,
        courseId: curso1.id,
      },
    });

    console.log(`Examen creado: ${examen1.title}`);

    // Crear preguntas para el examen
    const pregunta1 = await prisma.question.create({
      data: {
        content: '¿Qué es una variable en programación?',
        type: 'MULTIPLE_CHOICE',
        options: JSON.stringify([
          'Un valor que nunca cambia',
          'Un contenedor para almacenar datos',
          'Un tipo de función',
          'Un operador lógico'
        ]),
        answer: 'Un contenedor para almacenar datos',
        explanation: 'Las variables son contenedores para almacenar datos que pueden cambiar durante la ejecución del programa.',
        points: 10,
        examId: examen1.id,
      },
    });

    console.log(`Pregunta creada: ${pregunta1.content}`);

    console.log('Proceso de sembrado completado exitosamente.');
  } catch (error) {
    console.error('Error durante el proceso de sembrado:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
