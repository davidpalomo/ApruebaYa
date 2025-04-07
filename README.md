## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**
Equipo de Desarrollo ApruebaYa

### **0.2. Nombre del proyecto:**
ApruebaYa

### **0.3. Descripción breve del proyecto:**
Plataforma de estudio personalizada que permite a estudiantes subir su propio contenido, generar planes de estudio adaptativos y realizar exámenes simulados con IA generativa y OCR.

### **0.4. URL del proyecto:**
https://apruebaYa.vercel.app

### 0.5. URL o archivo comprimido del repositorio
Se entrega como archivo ZIP con el contenido completo del proyecto.

---

## 1. Descripción general del producto

### **1.1. Objetivo:**
ApruebaYa tiene como objetivo facilitar la preparación de oposiciones y certificaciones, adaptando el contenido a las necesidades específicas de cada estudiante. La plataforma permite a los usuarios subir sus propios materiales de estudio, a partir de los cuales la IA genera planes personalizados y exámenes de práctica, optimizando el tiempo de estudio y aumentando las probabilidades de éxito.

El valor principal que aporta es la personalización completa del proceso de estudio, eliminando la necesidad de adaptarse a materiales genéricos que no se ajustan a las necesidades particulares del estudiante. Está dirigido principalmente a opositores, estudiantes de certificaciones técnicas y profesionales que necesitan preparar exámenes específicos con material propio.

### **1.2. Características y funcionalidades principales:**

1. **OCR y parser inteligente de documentos**: 
   - Procesamiento de documentos PDF, Word e imágenes mediante Tesseract.js
   - Extracción inteligente de texto con preservación de estructura
   - Indexación vectorial del contenido para búsquedas semánticas

2. **Generación de planes de estudio con IA**:
   - Creación de planes personalizados basados en el contenido subido
   - Adaptación a la disponibilidad de tiempo del estudiante
   - Priorización inteligente de temas según su importancia
   - Sesiones de estudio estructuradas con objetivos claros

3. **Creación de exámenes simulados adaptativos**:
   - Generación de preguntas basadas en el contenido del usuario
   - Adaptación del nivel de dificultad según el rendimiento
   - Diferentes tipos de preguntas (opción múltiple, verdadero/falso)
   - Explicaciones detalladas de las respuestas correctas

4. **Dashboard de progreso y análisis**:
   - Visualización del avance en el plan de estudio
   - Estadísticas de rendimiento en exámenes
   - Identificación de áreas de mejora
   - Recomendaciones personalizadas

### **1.3. Diseño y experiencia de usuario:**

ApruebaYa presenta un diseño minimalista y responsive implementado con React, Tailwind CSS y HeadlessUI, priorizando la usabilidad y la experiencia del usuario. La interfaz se adapta a diferentes dispositivos, permitiendo estudiar tanto desde un ordenador como desde un dispositivo móvil.

El flujo de usuario típico incluye:

1. **Dashboard inicial**: Muestra un resumen de los cursos, progreso y accesos rápidos.
   ![Dashboard](./docs/screenshots/dashboard.png)

2. **Gestión de cursos**: Permite crear y administrar cursos personalizados.
   ![Lista de Cursos](./docs/screenshots/course-list.png)

3. **Carga de documentos**: Interfaz intuitiva para subir y procesar materiales de estudio.
   ![Carga de Documentos](./docs/screenshots/document-upload.png)

4. **Generación de plan de estudio**: Creación de planes personalizados con IA.
   ![Generación de Plan de Estudio](./docs/screenshots/study-plan.png)

5. **Realización de exámenes**: Interfaz clara para realizar tests y revisar resultados.
   ![Realización de Exámenes](./docs/screenshots/take-exam.png)

Para ver más capturas de pantalla, consulte el archivo [screenshots.md](./docs/screenshots.md).

### **1.4. Instrucciones de instalación:**

#### Requisitos previos
- Docker 20.10.0 o superior
- Docker Compose 2.0.0 o superior
- Al menos 4GB de RAM disponible para los contenedores
- Conexión a internet (para acceder a la API de Gemini)

#### Instalación con Docker (recomendado)
1. Clonar el repositorio o descomprimir el archivo ZIP:
   ```bash
   # Si usas Git
   git clone https://github.com/tu-usuario/apruebaYa.git
   cd apruebaYa
   
   # Si tienes el archivo ZIP
   unzip ApruebaYa_Proyecto_Final_Docker.zip -d apruebaYa
   cd apruebaYa
   ```

2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   El archivo `.env` ya contiene las siguientes variables configuradas:
   ```
   GEMINI_API_KEY=AIzaSyAI-6CP00lorMekdzC_T9B8hO8wU389uIo
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/apruebaYa
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. Iniciar los contenedores:
   ```bash
   docker-compose up -d
   ```

4. Verificar que los contenedores estén funcionando:
   ```bash
   docker-compose ps
   ```
   Deberías ver tres contenedores en estado "Up": postgres, backend y frontend.

5. La aplicación estará disponible en:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Documentación API: http://localhost:3001/api-docs

#### Verificación de funcionalidades

1. **OCR y procesamiento de documentos**:
   - Accede a un curso existente o crea uno nuevo
   - Haz clic en "Subir Documento"
   - Arrastra o selecciona un archivo PDF o imagen
   - Verifica que el documento se procese correctamente

2. **Generación de planes de estudio con IA**:
   - Accede a un curso con documentos subidos
   - Haz clic en "Generar Plan de Estudio"
   - Configura la duración del plan y haz clic en "Generar"

3. **Creación de exámenes simulados**:
   - Accede a un curso con documentos subidos
   - Haz clic en "Exámenes"
   - Haz clic en "Nuevo Examen"
   - Configura los parámetros del examen y haz clic en "Crear Examen"

#### Reconstrucción de contenedores

Si necesitas reconstruir los contenedores después de cambios en el código o para resolver problemas:

1. Detener y eliminar los contenedores existentes:
   ```bash
   docker-compose down
   ```

2. Reconstruir las imágenes:
   ```bash
   docker-compose build --no-cache
   ```

3. Iniciar los contenedores nuevamente:
   ```bash
   docker-compose up -d
   ```

4. Para ver los logs y verificar que todo funciona correctamente:
   ```bash
   docker-compose logs -f
   ```

Este proceso garantiza que:
- Se instalen todas las dependencias actualizadas
- Se ejecuten las migraciones de la base de datos automáticamente
- Se generen los datos iniciales en la base de datos

#### Solución de problemas comunes

Si la base de datos no se inicializa correctamente:
```bash
docker-compose restart backend
```

Si hay problemas con las dependencias:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

Para más detalles sobre el despliegue con Docker, consulta la [Guía de Despliegue con Docker](./docs/docker-deployment-guide.md).

#### Instalación para desarrollo (alternativa)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/apruebaYa.git
   cd apruebaYa
   ```

2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con las credenciales necesarias.

3. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

4. Instalar dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

5. Iniciar la base de datos con Docker:
   ```bash
   cd ..
   docker-compose up -d postgres
   ```

6. Ejecutar migraciones de la base de datos:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

7. Iniciar el backend en modo desarrollo:
   ```bash
   npm run dev
   ```

8. En otra terminal, iniciar el frontend en modo desarrollo:
   ```bash
   cd frontend
   npm start
   ```

9. La aplicación estará disponible en:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

```mermaid
graph TD
    subgraph "Frontend (React + Tailwind)"
        A[Componentes UI] --> B[Servicios API]
        B --> C[Estado Global]
        C --> A
    end
    
    subgraph "Backend (Express)"
        D[Controllers] --> E[Use Cases]
        E --> F[Domain Entities]
        E --> G[Repositories]
        G --> H[ORM/DB Adapters]
    end
    
    subgraph "Servicios Externos"
        I[Gemini Flash API]
        J[Tesseract.js OCR]
        K[FAISS Vector DB]
    end
    
    B --> D
    E --> I
    E --> J
    G --> K
    
    subgraph "Base de Datos"
        L[PostgreSQL]
    end
    
    H --> L
```

El proyecto sigue una arquitectura hexagonal (también conocida como puertos y adaptadores) en el backend, combinada con una arquitectura de componentes en el frontend. Esta elección se basa en los siguientes criterios:

**Beneficios de la arquitectura hexagonal:**
- **Separación de responsabilidades**: Clara distinción entre dominio, aplicación e infraestructura.
- **Testabilidad**: Facilita la creación de pruebas unitarias al permitir la sustitución de adaptadores.
- **Flexibilidad**: Permite cambiar componentes externos (base de datos, servicios) sin afectar la lógica de negocio.
- **Mantenibilidad**: Código más organizado y fácil de mantener a largo plazo.

**Sacrificios o déficits:**
- **Complejidad inicial**: Requiere más tiempo de configuración y una curva de aprendizaje más pronunciada.
- **Overhead**: Puede introducir más capas de abstracción que una arquitectura más simple.
- **Sobreingeniería para proyectos pequeños**: Podría ser excesivo para aplicaciones muy simples.

Para este proyecto, los beneficios superan claramente los déficits, especialmente considerando la necesidad de integrar múltiples servicios externos (OCR, IA) y la importancia de mantener un código testeable y mantenible.

### **2.2. Descripción de componentes principales:**

**Frontend:**
- **React**: Framework de UI para construir la interfaz de usuario con componentes reutilizables.
- **Tailwind CSS**: Framework de utilidades CSS para un diseño rápido y consistente.
- **HeadlessUI**: Componentes accesibles sin estilos predefinidos para mayor flexibilidad.
- **React Router**: Gestión de rutas y navegación en la aplicación.
- **Axios**: Cliente HTTP para comunicación con la API del backend.
- **React Query**: Gestión de estado del servidor y caché de datos.

**Backend:**
- **Express**: Framework de Node.js para crear la API REST.
- **Prisma ORM**: ORM para interactuar con la base de datos PostgreSQL.
- **Multer**: Middleware para gestionar la carga de archivos.
- **Tesseract.js**: Biblioteca de OCR para extraer texto de documentos e imágenes.
- **Haystack + FAISS**: Motor de búsqueda vectorial para implementar RAG (Retrieval Augmented Generation).
- **Gemini Flash API**: Servicio de IA para generación de contenido personalizado.

**Base de datos:**
- **PostgreSQL**: Sistema de gestión de base de datos relacional.

**Infraestructura:**
- **Docker**: Contenedores para desarrollo y despliegue consistentes.
- **NGINX**: Servidor web y proxy inverso para producción.

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

```
ApruebaYa/
├── frontend/                  # Aplicación React
│   ├── public/                # Archivos estáticos
│   ├── src/                   # Código fuente
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios de API
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilidades
│   │   └── assets/            # Imágenes, iconos, etc.
│   ├── tests/                 # Tests con React Testing Library
│   ├── package.json           # Dependencias
│   └── Dockerfile             # Configuración de Docker
│
├── backend/                   # API Express
│   ├── src/                   # Código fuente
│   │   ├── domain/            # Entidades y reglas de negocio
│   │   │   ├── entities/      # Modelos de dominio
│   │   │   ├── ports/         # Interfaces de repositorios
│   │   │   └── usecases/      # Casos de uso
│   │   ├── application/       # Lógica de aplicación
│   │   └── infrastructure/    # Implementaciones concretas
│   │       ├── controllers/   # Controladores de API
│   │       ├── repositories/  # Implementaciones de repositorios
│   │       └── services/      # Servicios externos (OCR, IA)
│   ├── tests/                 # Tests con Jest
│   ├── package.json           # Dependencias
│   └── Dockerfile             # Configuración de Docker
│
├── database/                  # Configuración de base de datos
│   ├── migrations/            # Migraciones de Prisma
│   ├── seeds/                 # Datos iniciales
│   └── schema.prisma          # Esquema de Prisma
│
├── docs/                      # Documentación
│   ├── architecture/          # Diagramas y explicaciones
│   ├── api/                   # Documentación de API
│   ├── database/              # Modelo de datos
│   └── screenshots/           # Capturas de pantalla
│
├── scripts/                   # Scripts de utilidad
│   └── setup/                 # Scripts de configuración
│
├── docker-compose.yml         # Configuración de Docker Compose
└── .env.example               # Plantilla de variables de entorno
```

La estructura del proyecto sigue los principios de la arquitectura hexagonal en el backend:

- **Domain**: Contiene las entidades de negocio, puertos (interfaces) y casos de uso, independientes de la infraestructura.
- **Application**: Orquesta los casos de uso y gestiona la lógica de aplicación.
- **Infrastructure**: Implementa los adaptadores para interactuar con servicios externos, bases de datos y la API REST.

El frontend sigue una estructura basada en componentes, con separación clara entre páginas, componentes reutilizables y servicios.

### **2.4. Infraestructura y despliegue**

```mermaid
graph TD
    subgraph "Desarrollo Local"
        A[Docker Compose] --> B[Contenedor Frontend]
        A --> C[Contenedor Backend]
        A --> D[Contenedor PostgreSQL]
    end
    
    subgraph "CI/CD (GitHub Actions)"
        E[Push a main] --> F[Tests]
        F --> G[Build]
        G --> H[Deploy]
    end
    
    subgraph "Producción"
        I[Vercel] --> J[Frontend]
        K[Railway] --> L[Backend API]
        M[Supabase] --> N[PostgreSQL]
    end
    
    H --> I
    H --> K
    H --> M
```

**Infraestructura:**
- **Desarrollo**: Entorno local con Docker Compose que orquesta tres contenedores: frontend, backend y base de datos.
- **Producción**: 
  - Frontend desplegado en Vercel
  - Backend API desplegado en Railway
  - Base de datos PostgreSQL alojada en Supabase

**Proceso de despliegue:**
1. Los desarrolladores trabajan en ramas de feature
2. Al completar una feature, se crea un Pull Request a la rama main
3. GitHub Actions ejecuta los tests automáticamente
4. Tras la aprobación y merge, se dispara el pipeline de CI/CD
5. El pipeline construye las imágenes y despliega en los servicios correspondientes
6. Se realizan pruebas de smoke test en el entorno de producción

Este enfoque permite un despliegue continuo y automatizado, minimizando los errores humanos y garantizando que solo el código probado llegue a producción.

### **2.5. Seguridad**

El proyecto implementa las siguientes prácticas de seguridad:

1. **Gestión segura de variables de entorno**:
   - Todas las credenciales y configuraciones sensibles se almacenan en archivos `.env` que no se versionan
   - Ejemplo: `GEMINI_API_KEY=************` en lugar de hardcodear la clave en el código

2. **Validación y sanitización de entradas**:
   - Todos los datos de entrada son validados antes de procesarse
   - Ejemplo: 
     ```javascript
     // Validación de entrada en el controlador de cursos
     if (!req.body.title || req.body.title.trim() === '') {
       return res.status(400).json({ error: 'El título es obligatorio' });
     }
     ```

3. **Protección contra ataques comunes**:
   - Implementación de rate limiting para prevenir ataques de fuerza bruta
   - Configuración de CORS para restringir el acceso a la API
   - Validación de tipos de archivos para prevenir ataques de upload
   - Ejemplo:
     ```javascript
     // Configuración de CORS
     app.use(cors({
       origin: process.env.NODE_ENV === 'production' 
         ? 'https://apruebaYa.vercel.app' 
         : 'http://localhost:3000'
     }));
     ```

4. **Preparación para autenticación segura**:
   - Estructura preparada para implementar OAuth y JWT
   - Protección contra CSRF planificada

5. **Seguridad en la base de datos**:
   - Uso de Prisma ORM que previene inyecciones SQL
   - Acceso a la base de datos a través de usuario con permisos limitados

### **2.6. Tests**

El proyecto incluye tests exhaustivos tanto para el frontend como para el backend:

**Tests de Frontend (React Testing Library):**
```javascript
// Ejemplo de test para el componente Dashboard
test('muestra mensaje cuando no hay cursos', async () => {
  // Mock del servicio API para simular respuesta vacía
  apiService.getCourses.mockResolvedValue([]);
  
  render(<Dashboard />);
  
  // Verificar que se muestra el mensaje correcto
  expect(await screen.findByText('No tienes cursos creados')).toBeInTheDocument();
  expect(screen.getByText('Crea tu primer curso para comenzar')).toBeInTheDocument();
});
```

**Tests de Backend (Jest):**
```javascript
// Ejemplo de test para el caso de uso GenerateStudyPlanUseCase
test('debe generar un plan de estudio correctamente', async () => {
  // Mocks de repositorios y servicios
  const mockCourseRepository = { findById: jest.fn() };
  const mockDocumentRepository = { findByCourseId: jest.fn() };
  const mockSessionRepository = { save: jest.fn() };
  const mockAIService = { generateStudySession: jest.fn() };
  
  // Configuración de mocks
  mockCourseRepository.findById.mockResolvedValue({ id: '1', title: 'Curso Test' });
  mockDocumentRepository.findByCourseId.mockResolvedValue([{ id: '1' }]);
  mockAIService.generateStudySession.mockResolvedValue({ sessions: [{ title: 'Sesión 1' }] });
  mockSessionRepository.save.mockResolvedValue({ id: '1', title: 'Sesión 1' });
  
  // Instancia del caso de uso
  const useCase = new GenerateStudyPlanUseCase(
    mockCourseRepository,
    mockDocumentRepository,
    mockSessionRepository,
    mockAIService
  );
  
  // Ejecución y verificación
  const result = await useCase.execute('1', 14);
  expect(result).toHaveProperty('sessions');
  expect(result.sessions).toHaveLength(1);
});
```

Para ver un resumen completo de los tests ejecutados, consulte el archivo [test-results.md](./docs/test-results.md).

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

```mermaid
erDiagram
    Course {
        String id PK
        String title
        String description
        DateTime createdAt
        DateTime updatedAt
    }
    
    Document {
        String id PK
        String title
        String fileName
        String filePath
        String fileType
        String content
        String courseId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    VectorIndex {
        String id PK
        String documentId FK
        String indexPath
        Int chunkCount
        DateTime createdAt
        DateTime updatedAt
    }
    
    Session {
        String id PK
        String title
        String description
        DateTime startDate
        DateTime endDate
        Int duration
        Boolean completed
        String courseId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    Topic {
        String id PK
        String title
        String content
        Int priority
        String sessionId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    Exam {
        String id PK
        String title
        String description
        Int duration
        Int passingScore
        String courseId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    Question {
        String id PK
        String content
        String type
        String[] options
        String answer
        String explanation
        Int points
        String examId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    ExamAttempt {
        String id PK
        DateTime startTime
        DateTime endTime
        Float score
        Boolean passed
        String examId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    Response {
        String id PK
        String content
        Boolean correct
        String questionId FK
        String attemptId FK
        DateTime createdAt
        DateTime updatedAt
    }
    
    Course ||--o{ Document : "contiene"
    Document ||--o| VectorIndex : "tiene"
    Course ||--o{ Session : "tiene"
    Session ||--o{ Topic : "contiene"
    Course ||--o{ Exam : "tiene"
    Exam ||--o{ Question : "contiene"
    Exam ||--o{ ExamAttempt : "tiene"
    ExamAttempt ||--o{ Response : "contiene"
    Question ||--o{ Response : "responde"
```

### **3.2. Descripción de entidades principales:**

#### Course (Curso)

Representa un curso creado por el usuario.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del curso | PK, UUID |
| title | String | Título del curso | NOT NULL |
| description | String | Descripción del curso | - |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un curso puede tener múltiples documentos (1:N)
- Un curso puede tener múltiples sesiones de estudio (1:N)
- Un curso puede tener múltiples exámenes (1:N)

#### Document (Documento)

Representa un documento subido por el usuario para un curso específico.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del documento | PK, UUID |
| title | String | Título del documento | NOT NULL |
| fileName | String | Nombre del archivo original | NOT NULL |
| filePath | String | Ruta de almacenamiento del archivo | NOT NULL |
| fileType | String | Tipo MIME del archivo | NOT NULL |
| content | String | Contenido extraído mediante OCR | - |
| courseId | String | ID del curso al que pertenece | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un documento pertenece a un único curso (N:1)
- Un documento tiene un único índice vectorial (1:1)

#### VectorIndex (Índice Vectorial)

Representa el índice vectorial generado para un documento, utilizado por el motor RAG.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del índice | PK, UUID |
| documentId | String | ID del documento indexado | FK, NOT NULL, UNIQUE |
| indexPath | String | Ruta de almacenamiento del índice | NOT NULL |
| chunkCount | Int | Número de fragmentos en el índice | NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un índice vectorial pertenece a un único documento (1:1)

#### Session (Sesión de Estudio)

Representa una sesión de estudio generada por la IA para un curso.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único de la sesión | PK, UUID |
| title | String | Título de la sesión | NOT NULL |
| description | String | Descripción de la sesión | - |
| startDate | DateTime | Fecha y hora de inicio programada | NOT NULL |
| endDate | DateTime | Fecha y hora de finalización | - |
| duration | Int | Duración en minutos | NOT NULL |
| completed | Boolean | Indica si la sesión ha sido completada | NOT NULL, default: false |
| courseId | String | ID del curso al que pertenece | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Una sesión pertenece a un único curso (N:1)
- Una sesión puede tener múltiples temas (1:N)

#### Topic (Tema)

Representa un tema específico dentro de una sesión de estudio.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del tema | PK, UUID |
| title | String | Título del tema | NOT NULL |
| content | String | Contenido del tema | NOT NULL |
| priority | Int | Prioridad del tema (1-5) | NOT NULL |
| sessionId | String | ID de la sesión a la que pertenece | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un tema pertenece a una única sesión (N:1)

#### Exam (Examen)

Representa un examen generado por la IA para un curso.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del examen | PK, UUID |
| title | String | Título del examen | NOT NULL |
| description | String | Descripción del examen | - |
| duration | Int | Duración en minutos | NOT NULL |
| passingScore | Int | Puntuación mínima para aprobar (0-100) | NOT NULL |
| courseId | String | ID del curso al que pertenece | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un examen pertenece a un único curso (N:1)
- Un examen puede tener múltiples preguntas (1:N)
- Un examen puede tener múltiples intentos (1:N)

#### Question (Pregunta)

Representa una pregunta dentro de un examen.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único de la pregunta | PK, UUID |
| content | String | Contenido de la pregunta | NOT NULL |
| type | String | Tipo de pregunta (MULTIPLE_CHOICE, TRUE_FALSE) | NOT NULL |
| options | String[] | Opciones de respuesta | NOT NULL |
| answer | String | Respuesta correcta | NOT NULL |
| explanation | String | Explicación de la respuesta correcta | - |
| points | Int | Puntos asignados a la pregunta | NOT NULL, default: 1 |
| examId | String | ID del examen al que pertenece | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Una pregunta pertenece a un único examen (N:1)
- Una pregunta puede tener múltiples respuestas (1:N)

#### ExamAttempt (Intento de Examen)

Representa un intento de realización de un examen por parte del usuario.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único del intento | PK, UUID |
| startTime | DateTime | Fecha y hora de inicio | NOT NULL |
| endTime | DateTime | Fecha y hora de finalización | - |
| score | Float | Puntuación obtenida (0-100) | - |
| passed | Boolean | Indica si el examen ha sido aprobado | - |
| examId | String | ID del examen realizado | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Un intento pertenece a un único examen (N:1)
- Un intento puede tener múltiples respuestas (1:N)

#### Response (Respuesta)

Representa una respuesta dada por el usuario a una pregunta en un intento de examen.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | String | Identificador único de la respuesta | PK, UUID |
| content | String | Contenido de la respuesta | NOT NULL |
| correct | Boolean | Indica si la respuesta es correcta | NOT NULL |
| questionId | String | ID de la pregunta respondida | FK, NOT NULL |
| attemptId | String | ID del intento de examen | FK, NOT NULL |
| createdAt | DateTime | Fecha de creación | NOT NULL, default: now() |
| updatedAt | DateTime | Fecha de última actualización | NOT NULL, default: now() |

**Relaciones:**
- Una respuesta pertenece a una única pregunta (N:1)
- Una respuesta pertenece a un único intento de examen (N:1)

---

## 4. Especificación de la API

A continuación se describen los tres endpoints principales de la API de ApruebaYa:

### 1. Subir un documento

```yaml
paths:
  /api/documents:
    post:
      summary: Subir un nuevo documento
      description: Permite subir un documento (PDF, DOC, DOCX, TXT, JPG, JPEG, PNG) y asociarlo a un curso
      tags:
        - Documentos
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - title
                - courseId
                - file
              properties:
                title:
                  type: string
                  description: Título del documento
                courseId:
                  type: string
                  description: ID del curso al que pertenece el documento
                file:
                  type: string
                  format: binary
                  description: Archivo a subir
      responses:
        '201':
          description: Documento creado correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  title:
                    type: string
                  fileName:
                    type: string
                  filePath:
                    type: string
                  fileType:
                    type: string
                  content:
                    type: string
                  courseId:
                    type: string
                  createdAt:
                    type: string
                    format: date-time
                  updatedAt:
                    type: string
                    format: date-time
        '400':
          description: Datos inválidos
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '404':
          description: Curso no encontrado
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
```

**Ejemplo de petición:**
```
POST /api/documents HTTP/1.1
Host: localhost:3001
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

Introducción a Python
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="courseId"

1
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="python_intro.pdf"
Content-Type: application/pdf

(contenido binario del archivo)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Ejemplo de respuesta:**
```json
{
  "id": "1",
  "title": "Introducción a Python",
  "fileName": "python_intro.pdf",
  "filePath": "/uploads/python_intro.pdf",
  "fileType": "application/pdf",
  "content": "Contenido extraído del documento...",
  "courseId": "1",
  "createdAt": "2025-04-06T10:30:00.000Z",
  "updatedAt": "2025-04-06T10:30:00.000Z"
}
```

### 2. Generar plan de estudio

```yaml
paths:
  /api/courses/{courseId}/study-plan:
    post:
      summary: Generar plan de estudio
      description: Genera un plan de estudio personalizado basado en los documentos del curso
      tags:
        - Planes de Estudio
      parameters:
        - name: courseId
          in: path
          required: true
          schema:
            type: string
          description: ID del curso
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - duration
              properties:
                duration:
                  type: integer
                  description: Duración del plan en días
      responses:
        '200':
          description: Plan de estudio generado correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  course:
                    type: object
                    properties:
                      id:
                        type: string
                      title:
                        type: string
                      description:
                        type: string
                  sessions:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        title:
                          type: string
                        description:
                          type: string
                        startDate:
                          type: string
                          format: date-time
                        endDate:
                          type: string
                          format: date-time
                          nullable: true
                        duration:
                          type: integer
                        completed:
                          type: boolean
                        courseId:
                          type: string
                        topics:
                          type: array
                          items:
                            type: object
                            properties:
                              id:
                                type: string
                              title:
                                type: string
                              content:
                                type: string
                              priority:
                                type: integer
                              sessionId:
                                type: string
        '400':
          description: Datos inválidos o curso sin documentos
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '404':
          description: Curso no encontrado
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
```

**Ejemplo de petición:**
```
POST /api/courses/1/study-plan HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "duration": 14
}
```

**Ejemplo de respuesta:**
```json
{
  "course": {
    "id": "1",
    "title": "Curso de Python",
    "description": "Aprende Python desde cero"
  },
  "sessions": [
    {
      "id": "1",
      "title": "Introducción a Python",
      "description": "Conceptos básicos y entorno de desarrollo",
      "startDate": "2025-04-07T10:00:00.000Z",
      "endDate": null,
      "duration": 60,
      "completed": false,
      "courseId": "1",
      "topics": [
        {
          "id": "1",
          "title": "¿Qué es Python?",
          "content": "Python es un lenguaje de programación interpretado...",
          "priority": 1,
          "sessionId": "1"
        },
        {
          "id": "2",
          "title": "Instalación de Python",
          "content": "Pasos para instalar Python en diferentes sistemas operativos...",
          "priority": 2,
          "sessionId": "1"
        }
      ]
    },
    {
      "id": "2",
      "title": "Variables y Tipos de Datos",
      "description": "Aprende sobre los diferentes tipos de datos en Python",
      "startDate": "2025-04-08T10:00:00.000Z",
      "endDate": null,
      "duration": 60,
      "completed": false,
      "courseId": "1",
      "topics": [
        {
          "id": "3",
          "title": "Variables en Python",
          "content": "Declaración y uso de variables...",
          "priority": 1,
          "sessionId": "2"
        },
        {
          "id": "4",
          "title": "Tipos de datos básicos",
          "content": "Números, cadenas, booleanos...",
          "priority": 2,
          "sessionId": "2"
        }
      ]
    }
  ]
}
```

### 3. Generar examen

```yaml
paths:
  /api/courses/{courseId}/exams:
    post:
      summary: Generar un nuevo examen
      description: Crea un examen con preguntas generadas por IA basadas en los documentos del curso
      tags:
        - Exámenes
      parameters:
        - name: courseId
          in: path
          required: true
          schema:
            type: string
          description: ID del curso
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - duration
                - questionCount
              properties:
                title:
                  type: string
                  description: Título del examen
                description:
                  type: string
                  description: Descripción del examen
                duration:
                  type: integer
                  description: Duración en minutos
                questionCount:
                  type: integer
                  description: Número de preguntas a generar
                questionTypes:
                  type: array
                  items:
                    type: string
                    enum: [MULTIPLE_CHOICE, TRUE_FALSE]
                  description: Tipos de preguntas a generar
      responses:
        '201':
          description: Examen creado correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  exam:
                    type: object
                    properties:
                      id:
                        type: string
                      title:
                        type: string
                      description:
                        type: string
                      duration:
                        type: integer
                      passingScore:
                        type: integer
                      courseId:
                        type: string
                      createdAt:
                        type: string
                        format: date-time
                      updatedAt:
                        type: string
                        format: date-time
                  questions:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        content:
                          type: string
                        type:
                          type: string
                        options:
                          type: array
                          items:
                            type: string
                        examId:
                          type: string
        '400':
          description: Datos inválidos o curso sin documentos
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        '404':
          description: Curso no encontrado
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
```

**Ejemplo de petición:**
```
POST /api/courses/1/exams HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "title": "Examen de Python Básico",
  "description": "Evaluación de conceptos básicos de Python",
  "duration": 60,
  "questionCount": 10,
  "questionTypes": ["MULTIPLE_CHOICE", "TRUE_FALSE"]
}
```

**Ejemplo de respuesta:**
```json
{
  "exam": {
    "id": "1",
    "title": "Examen de Python Básico",
    "description": "Evaluación de conceptos básicos de Python",
    "duration": 60,
    "passingScore": 60,
    "courseId": "1",
    "createdAt": "2025-04-06T14:00:00.000Z",
    "updatedAt": "2025-04-06T14:00:00.000Z"
  },
  "questions": [
    {
      "id": "1",
      "content": "¿Cuál es la sintaxis correcta para imprimir 'Hola Mundo' en Python?",
      "type": "MULTIPLE_CHOICE",
      "options": ["echo 'Hola Mundo'", "print('Hola Mundo')", "console.log('Hola Mundo')", "System.out.println('Hola Mundo')"],
      "examId": "1"
    },
    {
      "id": "2",
      "content": "Python es un lenguaje de programación interpretado.",
      "type": "TRUE_FALSE",
      "options": ["Verdadero", "Falso"],
      "examId": "1"
    }
  ]
}
```

---

## 5. Historias de Usuario

**Historia de Usuario 1: Carga de documentos de estudio**

**Como** estudiante que prepara una oposición  
**Quiero** poder subir mis propios documentos de estudio (PDF, imágenes, Word)  
**Para** que el sistema pueda analizarlos y crear contenido personalizado basado en ellos

**Criterios de aceptación:**
1. El sistema debe permitir la carga de archivos en formatos PDF, DOC, DOCX, TXT, JPG, JPEG y PNG
2. El tamaño máximo de archivo debe ser de 20MB
3. Al subir un documento, se debe mostrar una barra de progreso
4. Una vez subido, el sistema debe procesar el documento mediante OCR para extraer su contenido
5. El usuario debe poder asociar el documento a un curso específico
6. El usuario debe poder ver una lista de todos los documentos subidos para un curso
7. El usuario debe poder eliminar documentos si es necesario

**Notas técnicas:**
- Implementar Tesseract.js para OCR
- Almacenar los documentos en el sistema de archivos del servidor
- Extraer y almacenar el contenido en la base de datos para su posterior procesamiento
- Implementar validación de tipos de archivo y tamaño
- Crear índices vectoriales para cada documento procesado

**Historia de Usuario 2: Generación de plan de estudio personalizado**

**Como** estudiante con tiempo limitado  
**Quiero** que el sistema genere un plan de estudio personalizado basado en mis documentos  
**Para** optimizar mi tiempo y mejorar mi preparación para el examen

**Criterios de aceptación:**
1. El usuario debe poder seleccionar un curso para el que generar el plan
2. El usuario debe poder especificar la duración del plan (en días o semanas)
3. El sistema debe analizar los documentos del curso y generar un plan estructurado
4. El plan debe incluir sesiones de estudio con fecha, duración y temas a cubrir
5. Los temas deben estar priorizados según su importancia
6. El usuario debe poder ver el plan completo y navegar entre las diferentes sesiones
7. El usuario debe poder marcar sesiones como completadas
8. El sistema debe adaptar el plan si el usuario se retrasa en algunas sesiones

**Notas técnicas:**
- Utilizar Gemini Flash para analizar el contenido y generar el plan
- Implementar algoritmo de distribución de temas según la duración especificada
- Almacenar el plan en la base de datos para permitir actualizaciones
- Crear interfaz interactiva para visualizar y gestionar el plan

**Historia de Usuario 3: Realización de exámenes de práctica**

**Como** estudiante preparando una certificación  
**Quiero** poder realizar exámenes de práctica generados a partir de mis materiales  
**Para** evaluar mi nivel de preparación y familiarizarme con el formato del examen real

**Criterios de aceptación:**
1. El usuario debe poder generar un examen para un curso específico
2. El usuario debe poder configurar el número de preguntas y tipos (opción múltiple, verdadero/falso)
3. El sistema debe generar preguntas relevantes basadas en el contenido de los documentos
4. El examen debe tener un temporizador según la duración configurada
5. El usuario debe poder navegar entre las preguntas y modificar sus respuestas antes de enviar
6. Al finalizar, el sistema debe mostrar la puntuación obtenida y las respuestas correctas
7. El sistema debe proporcionar explicaciones para las respuestas incorrectas
8. El usuario debe poder ver un historial de sus intentos de examen

**Notas técnicas:**
- Utilizar Gemini Flash para generar preguntas contextuales
- Implementar diferentes tipos de preguntas (opción múltiple, verdadero/falso)
- Crear un sistema de puntuación y evaluación automática
- Almacenar historial de intentos para análisis de progreso
- Implementar temporizador con guardado automático de respuestas

---

## 6. Tickets de Trabajo

**Ticket 1: Implementación del servicio de OCR para procesamiento de documentos (Backend)**

**Título:** Implementar servicio de OCR con Tesseract.js

**Descripción:**  
Desarrollar un servicio en el backend que utilice Tesseract.js para procesar documentos PDF e imágenes, extraer su contenido textual y almacenarlo en la base de datos.

**Tareas:**
1. Instalar y configurar Tesseract.js y dependencias necesarias
2. Crear clase `TesseractOCRService` que implemente la interfaz `OCRService`
3. Implementar método para convertir PDF a imágenes usando pdf2image
4. Implementar método para preprocesar imágenes (mejorar contraste, eliminar ruido)
5. Implementar método para extraer texto de imágenes usando Tesseract
6. Implementar método para estructurar el contenido extraído
7. Integrar el servicio con el caso de uso `UploadDocumentUseCase`
8. Implementar manejo de errores y logging
9. Escribir tests unitarios para el servicio
10. Documentar la implementación y uso del servicio

**Criterios de aceptación:**
- El servicio debe procesar correctamente documentos PDF de hasta 50 páginas
- El servicio debe procesar imágenes en formatos JPG, JPEG y PNG
- El tiempo de procesamiento no debe exceder 2 minutos para un documento de 10 páginas
- La precisión del OCR debe ser superior al 90% para textos claros
- Los tests unitarios deben cubrir al menos el 80% del código
- El servicio debe manejar adecuadamente errores como archivos corruptos o formatos no soportados

**Estimación:** 3 días

**Prioridad:** Alta

**Dependencias:**
- Ticket #123: Implementar carga de archivos con Multer
- Ticket #124: Crear entidad Document y repositorio

**Ticket 2: Implementación de la página de carga de documentos (Frontend)**

**Título:** Desarrollar componente de carga de documentos con React

**Descripción:**  
Crear una interfaz de usuario para la carga de documentos que permita a los usuarios seleccionar archivos, asociarlos a un curso y visualizar el progreso de carga y procesamiento.

**Tareas:**
1. Crear componente `DocumentUpload` con React y Tailwind CSS
2. Implementar área de drag & drop para selección de archivos
3. Integrar react-dropzone para gestión de archivos
4. Implementar validación de tipos y tamaños de archivo en el cliente
5. Crear formulario para ingresar título del documento y seleccionar curso
6. Implementar barra de progreso para carga y procesamiento
7. Integrar con el servicio de API para enviar archivos al backend
8. Implementar manejo de errores y mensajes de feedback
9. Crear vista de lista de documentos cargados
10. Implementar funcionalidad de eliminación de documentos
11. Escribir tests con React Testing Library
12. Asegurar que el diseño sea responsive

**Criterios de aceptación:**
- El componente debe permitir seleccionar archivos mediante drag & drop o botón de selección
- Debe mostrar una previsualización del archivo seleccionado cuando sea posible
- Debe validar el tipo y tamaño del archivo antes de iniciar la carga
- Debe mostrar una barra de progreso durante la carga y procesamiento
- Debe mostrar mensajes de error claros cuando ocurran problemas
- Debe ser responsive y funcionar correctamente en dispositivos móviles
- Los tests deben cubrir los casos de uso principales

**Estimación:** 2 días

**Prioridad:** Alta

**Dependencias:**
- Ticket #125: Implementar servicio de API para documentos
- Ticket #126: Crear componentes base de UI

**Ticket 3: Diseño e implementación del modelo de datos (Base de Datos)**

**Título:** Diseñar e implementar esquema de base de datos con Prisma ORM

**Descripción:**  
Diseñar e implementar el esquema de base de datos relacional para la aplicación utilizando Prisma ORM, incluyendo todas las entidades necesarias y sus relaciones.

**Tareas:**
1. Analizar los requisitos de datos de la aplicación
2. Diseñar el modelo entidad-relación completo
3. Crear el archivo schema.prisma con todas las entidades
4. Definir los tipos de datos, claves primarias y foráneas
5. Implementar relaciones entre entidades (1:1, 1:N, N:M)
6. Definir índices para optimizar consultas frecuentes
7. Crear migraciones iniciales de la base de datos
8. Implementar validaciones a nivel de base de datos
9. Crear script de semillas para datos de prueba
10. Documentar el modelo de datos y decisiones de diseño

**Criterios de aceptación:**
- El esquema debe incluir todas las entidades necesarias (Course, Document, VectorIndex, Session, Topic, Exam, Question, ExamAttempt, Response)
- Las relaciones entre entidades deben estar correctamente definidas
- Las migraciones deben ejecutarse sin errores
- El script de semillas debe crear datos de prueba coherentes
- El modelo debe seguir las mejores prácticas de diseño de bases de datos relacionales
- La documentación debe incluir un diagrama entidad-relación y descripción de cada entidad

**Estimación:** 2 días

**Prioridad:** Alta

**Dependencias:**
- Ticket #127: Configurar entorno de base de datos PostgreSQL
- Ticket #128: Definir requisitos de almacenamiento de datos

---

## 7. Pull requests

[Esta sección será completada por el usuario]
