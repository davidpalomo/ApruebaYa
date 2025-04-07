module.exports = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3001,
    host: '0.0.0.0',
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  
  // Configuración de la base de datos
  database: {
    url: process.env.DATABASE_URL,
    logging: process.env.NODE_ENV === 'development'
  },
  
  // Configuración de almacenamiento de archivos
  storage: {
    uploadDir: process.env.UPLOAD_DIR || '/app/uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '20971520'), // 20MB en bytes
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ]
  },
  
  // Configuración de OCR
  ocr: {
    lang: process.env.TESSERACT_LANG || 'spa',
    timeout: parseInt(process.env.OCR_TIMEOUT || '300000'), // 5 minutos en milisegundos
    preprocess: true
  },
  
  // Configuración de IA
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40
  },
  
  // Configuración de RAG
  rag: {
    vectorIndexDir: process.env.VECTOR_INDEX_DIR || '/app/vector_indices',
    chunkSize: parseInt(process.env.CHUNK_SIZE || '1000'),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200'),
    embeddingModel: 'sentence-transformers/all-MiniLM-L6-v2'
  },
  
  // Configuración de seguridad
  security: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15'), // minutos
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'), // solicitudes
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'", "https://api.gemini.com"]
        }
      }
    }
  },
  
  // Configuración de logging
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
  }
};
