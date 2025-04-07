// Implementación del servicio de IA usando Gemini Flash
const fetch = require('node-fetch');
const AIService = require('../../domain/ports/AIService');
const { LRUCache } = require('lru-cache');
const fs = require('fs');
const path = require('path');

class GeminiAIService extends AIService {
  constructor() {
    super();
    // Usar la variable de entorno para la API key
    this.apiKey = process.env.GEMINI_API_KEY;
    
    // Validación y logging para depuración
    if (!this.apiKey) {
      console.error('⚠️ ADVERTENCIA: GEMINI_API_KEY no está configurada en las variables de entorno, usando clave por defecto');
      // Usar una API key de respaldo como último recurso
      this.apiKey = 'AIzaSyAI-6CP00lorMekdzC_T9B8hO8wU389uIo';
    }
    
    console.log(`GeminiAIService inicializado. API Key configurada: ${this.apiKey ? '✅ SÍ' : '❌ NO'}`);
    
    this.model = 'gemini-2.0-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.cache = new LRUCache({ max: 100, ttl: 1000 * 60 * 60 }); // Cache de 1 hora
  }

  async _callGeminiAPI(prompt, temperature = 0.7) {
    // Verificar si la respuesta está en caché
    const cacheKey = `${prompt}_${temperature}`;
    if (this.cache.has(cacheKey)) {
      console.log('Usando respuesta en caché para prompt');
      return this.cache.get(cacheKey);
    }

    console.log('Llamando a la API de Gemini con prompt:', prompt.substring(0, 100) + '...');
    
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: 2048, // Aumentamos el tamaño máximo de tokens
            topP: 0.8,
            topK: 40
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error en la respuesta de Gemini:', data);
        throw new Error(`Error en la API de Gemini: ${data.error?.message || 'Error desconocido'}`);
      }
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        console.error('Respuesta inesperada de Gemini:', data);
        throw new Error('Formato de respuesta inesperado de la API de Gemini');
      }
      
      const result = data.candidates[0].content.parts[0].text;
      
      // Guardar en caché
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error al llamar a la API de Gemini:', error);
      throw new Error(`Error al llamar a la API de Gemini: ${error.message}`);
    }
  }

  async _getDocumentContent(documentIds) {
    try {
      // Importar PrismaClient para acceder a la base de datos
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Obtener documentos reales de la base de datos
      const documents = await prisma.document.findMany({
        where: {
          id: {
            in: documentIds
          }
        },
        select: {
          id: true,
          title: true,
          content: true,
          fileName: true
        }
      });
      
      // Cerrar la conexión de Prisma
      await prisma.$disconnect();
      
      if (!documents || documents.length === 0) {
        console.warn(`No se encontraron documentos con IDs: ${documentIds.join(', ')}`);
        return [];
      }
      
      console.log(`Obtenidos ${documents.length} documentos de la base de datos`);
      return documents;
    } catch (error) {
      console.error('Error al obtener contenido de documentos:', error);
      throw new Error(`Error al obtener contenido de documentos: ${error.message}`);
    }
  }

  async generateStudySession(courseId, documentIds, duration) {
    try {
      console.log(`Generando plan de estudio para curso ${courseId} con duración ${duration} horas`);
      
      // Obtener el contenido real de los documentos
      const documents = await this._getDocumentContent(documentIds);
      
      if (documents.length === 0) {
        throw new Error('No se encontraron documentos para el curso');
      }
      
      // Crear un resumen de cada documento con su ID y título para referencia
      const documentSummaries = documents.map(doc => 
        `Documento ID: ${doc.id} | Título: ${doc.title} | Nombre de archivo: ${doc.fileName || 'N/A'}`
      ).join('\n');
      
      // Crear el prompt para obtener una estructura general del plan
      const structurePrompt = `
        Eres un experto en educación y planificación de estudios. Necesito que analices el contenido de estos documentos y generes una estructura para un plan de estudio.
        
        Información del curso:
        - ID del curso: ${courseId}
        - Duración total disponible: ${duration} horas
        - Documentos disponibles:
        ${documentSummaries}
        
        Basándote en estos documentos, genera una estructura de plan de estudio que incluya:
        1. Entre 3 y 5 sesiones de estudio
        2. Para cada sesión, define entre 2 y 4 temas específicos a estudiar
        3. Indica qué documento se debe utilizar como fuente principal para cada tema
        
        IMPORTANTE: Tu respuesta debe estar en formato JSON, con la siguiente estructura exacta:
        {
          "sessions": [
            {
              "title": "Título de la sesión",
              "description": "Descripción general de la sesión",
              "startDate": "YYYY-MM-DD",
              "duration": 120,
              "topics": [
                {
                  "title": "Título del tema",
                  "documentId": "ID del documento principal para este tema",
                  "priority": 3
                }
              ]
            }
          ]
        }
        
        Asegúrate de responder solamente con el JSON, sin texto adicional.
      `;
      
      // Obtener la estructura del plan
      const structureResponse = await this._callGeminiAPI(structurePrompt, 0.7);
      const planStructure = this._extractJSON(structureResponse);
      
      if (!planStructure || !planStructure.sessions) {
        throw new Error('No se pudo generar la estructura del plan de estudio');
      }
      
      // Ahora, para cada tema, generamos contenido específico basado en el documento asociado
      const sessions = [];
      
      for (const session of planStructure.sessions) {
        const topicsWithContent = [];
        
        for (const topic of session.topics) {
          try {
            // Buscar el documento asociado
            let documentId = topic.documentId;
            let document = documents.find(doc => doc.id === documentId);
            
            // Si no se encuentra el documento específico, usar el primer documento disponible
            if (!document && documents.length > 0) {
              console.warn(`No se encontró el documento con ID ${documentId}. Usando el primer documento disponible.`);
              document = documents[0];
              documentId = document.id;
            }
            
            if (!document) {
              console.warn(`No hay documentos disponibles para el tema "${topic.title}"`);
              continue;
            }
            
            // Generar contenido específico para este tema basado en el documento
            const contentPrompt = `
              Eres un experto en educación y creación de contenido didáctico. Necesito que generes contenido específico para un tema de estudio basado en el siguiente documento:
              
              DOCUMENTO:
              Título: ${document.title}
              Contenido: ${document.content ? document.content.substring(0, 5000) : 'No hay contenido disponible'}
              
              TEMA:
              Título: ${topic.title}
              
              Genera un contenido educativo completo para este tema que:
              1. Explique los conceptos clave relacionados con el tema
              2. Incluya ejemplos prácticos cuando sea posible
              3. Resuma los puntos más importantes que el estudiante debe recordar
              4. Tenga entre 200-500 palabras
              
              Responde SOLO con el contenido, sin introducciones ni comentarios adicionales.
            `;
            
            // Obtener el contenido para este tema
            const topicContent = await this._callGeminiAPI(contentPrompt, 0.7);
            
            // Agregar el tema con su contenido y referencia al documento
            topicsWithContent.push({
              title: topic.title,
              content: topicContent.trim(),
              priority: topic.priority || 3,
              documentRef: {
                id: document.id,
                title: document.title,
                fileName: document.fileName
              }
            });
          } catch (topicError) {
            console.error(`Error al generar contenido para el tema "${topic.title}":`, topicError);
            
            // Agregar el tema con contenido básico
            topicsWithContent.push({
              title: topic.title,
              content: "No se pudo generar contenido para este tema. Por favor, consulta directamente los documentos del curso.",
              priority: topic.priority || 3,
              documentRef: topic.documentId ? {
                id: topic.documentId,
                title: documents.find(d => d.id === topic.documentId)?.title || "Documento no encontrado",
                fileName: documents.find(d => d.id === topic.documentId)?.fileName || "N/A"
              } : null
            });
          }
        }
        
        // Si la sesión no tiene temas con contenido, intentar añadir al menos uno
        if (topicsWithContent.length === 0 && documents.length > 0) {
          const document = documents[0];
          topicsWithContent.push({
            title: `Conceptos básicos de ${session.title}`,
            content: "Este tema proporciona una introducción a los conceptos fundamentales de la sesión. Revisa los documentos del curso para obtener información detallada.",
            priority: 2,
            documentRef: {
              id: document.id,
              title: document.title,
              fileName: document.fileName
            }
          });
        }
        
        // Agregar la sesión con sus temas a la lista
        sessions.push({
          title: session.title,
          description: session.description,
          startDate: session.startDate,
          duration: session.duration,
          topics: topicsWithContent
        });
      }
      
      return { sessions };
    } catch (error) {
      console.error('Error al generar el plan de estudio:', error);
      // Si ocurre un error, intentar generar un plan básico
      try {
        const simpleSession = await this._generateSimpleStudyPlan(courseId, documentIds, duration);
        return simpleSession;
      } catch (backupError) {
        console.error('Error al generar plan de estudio de respaldo:', backupError);
        throw new Error(`Error al generar el plan de estudio: ${error.message}`);
      }
    }
  }
  
  // Método para generar un plan de estudio básico en caso de errores
  async _generateSimpleStudyPlan(courseId, documentIds, duration) {
    const documents = await this._getDocumentContent(documentIds);
    
    if (documents.length === 0) {
      throw new Error('No hay documentos disponibles para generar un plan de estudio');
    }
    
    const sessions = [];
    
    // Crear una sesión por cada documento
    for (let i = 0; i < Math.min(documents.length, 3); i++) {
      const doc = documents[i];
      const topics = [];
      
      // Crear temas básicos para el documento
      topics.push({
        title: `Conceptos fundamentales de ${doc.title}`,
        content: "Este tema cubre los conceptos fundamentales presentados en el documento. Revísalo detenidamente para comprender las bases necesarias.",
        priority: 1,
        documentRef: {
          id: doc.id,
          title: doc.title,
          fileName: doc.fileName
        }
      });
      
      topics.push({
        title: `Aplicaciones prácticas de ${doc.title}`,
        content: "En este tema exploramos cómo aplicar los conceptos teóricos en situaciones prácticas. Utiliza el material de referencia para ver ejemplos concretos.",
        priority: 2,
        documentRef: {
          id: doc.id,
          title: doc.title,
          fileName: doc.fileName
        }
      });
      
      // Añadir la sesión
      sessions.push({
        title: `Sesión ${i+1}: Estudio de ${doc.title}`,
        description: `En esta sesión estudiaremos a fondo el documento "${doc.title}" y sus conceptos principales.`,
        startDate: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        duration: 120,
        topics: topics
      });
    }
    
    return { sessions };
  }

  // Método auxiliar para extraer JSON de respuestas de la API
  _extractJSON(response) {
    try {
      // Limpiar la respuesta de posibles caracteres adicionales
      let cleanedResponse = response.trim();
      
      // Eliminar backticks y bloque de código si existen
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      // Intentar parsear la respuesta limpia
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON:', parseError);
      console.log('Respuesta recibida:', response.substring(0, 200) + '...');
      
      // Intentar múltiples estrategias para extraer JSON
      const strategies = [
        // Buscar cualquier cosa entre llaves
        response.match(/\{[\s\S]*\}/),
        // Buscar específicamente después de marcadores comunes
        response.match(/```json\s*([\s\S]*?)```/),
        response.match(/```\s*([\s\S]*?)```/),
        response.match(/json\s*\{[\s\S]*\}/),
        // Intentar desde el primer carácter { hasta el último }
        (response.indexOf('{') >= 0 && response.lastIndexOf('}') >= 0) ? 
          response.substring(response.indexOf('{'), response.lastIndexOf('}')+1) : null
      ];
      
      // Intentar cada estrategia
      for (const match of strategies) {
        if (match) {
          try {
            const content = typeof match === 'string' ? match : match[1] || match[0];
            return JSON.parse(content);
          } catch (err) {
            // Continuar con la siguiente estrategia
          }
        }
      }
      
      // Si todas las estrategias fallan, crear un JSON básico con el texto como contenido
      console.log('Creando estructura JSON básica a partir del texto recibido');
      
      // Dividir el texto en secciones y crear sesiones
      const lines = response.split('\n').filter(line => line.trim().length > 0);
      const sessions = [];
      let currentSession = null;
      let currentTopic = null;
      
      for (const line of lines) {
        // Intentar identificar encabezados de sesión (normalmente líneas cortas en mayúsculas o con "Sesión" en ellas)
        if ((line.toUpperCase() === line && line.length < 50) || line.includes('Sesión') || line.includes('SESIÓN') || line.includes('Módulo') || line.includes('MÓDULO')) {
          if (currentSession && currentSession.topics.length > 0) {
            sessions.push(currentSession);
          }
          
          currentSession = {
            title: line.trim(),
            description: 'Sesión de estudio generada automáticamente',
            startDate: new Date(Date.now() + sessions.length * 86400000).toISOString().split('T')[0], // Un día después por cada sesión
            duration: 120, // 2 horas por defecto
            topics: []
          };
          
          currentTopic = null;
        } 
        // Identificar posibles temas (líneas que comienzan con números, viñetas o tienen "Tema" en ellas)
        else if (line.match(/^[0-9]+[.)]\s/) || line.match(/^[\-\*\•]\s/) || line.includes('Tema') || line.includes('TEMA')) {
          if (currentSession) {
            currentTopic = {
              title: line.trim(),
              content: '',
              priority: Math.floor(Math.random() * 3) + 1, // Prioridad aleatoria entre 1-3
              documentRef: null // Se establecerá después
            };
            
            currentSession.topics.push(currentTopic);
          }
        } 
        // Contenido para el tema actual
        else if (currentTopic) {
          currentTopic.content += line.trim() + '\n';
        }
        // Si no hay tema actual pero hay sesión, agregar a la descripción de la sesión
        else if (currentSession) {
          currentSession.description += ' ' + line.trim();
        }
      }
      
      // Añadir la última sesión si existe
      if (currentSession && currentSession.topics.length > 0) {
        sessions.push(currentSession);
      }
      
      // Si no se pudo extraer ninguna sesión, crear una básica
      if (sessions.length === 0) {
        sessions.push({
          title: 'Plan de Estudio Personalizado',
          description: 'Plan de estudio basado en los materiales del curso',
          startDate: new Date().toISOString().split('T')[0],
          duration: 120,
          topics: [{
            title: 'Revisión de materiales del curso',
            content: response.substring(0, 500), // Usar parte de la respuesta como contenido
            priority: 2,
            documentRef: null
          }]
        });
      }
      
      return { sessions };
    }
  }

  async generateExam(courseId, documentIds, questionCount, questionTypes = ['MULTIPLE_CHOICE', 'TRUE_FALSE']) {
    try {
      // Verificar que la API key esté configurada
      if (!this.apiKey || this.apiKey.trim() === '') {
        console.error('❌ Error crítico: API key de Gemini no configurada');
        throw new Error('API key de Gemini no configurada. Este servicio requiere una API key válida.');
      }
      
      console.log(`⏳ Generando examen para curso ${courseId} con ${questionCount} preguntas. Tipos: ${questionTypes.join(', ')}`);
      console.log(`📋 Documentos a procesar: ${documentIds.length} documentos.`);
      
      // Obtener el contenido real de los documentos
      const documents = await this._getDocumentContent(documentIds);
      console.log(`📚 Documentos obtenidos: ${documents.length}`);
      
      if (!documents || documents.length === 0) {
        throw new Error('No se encontraron documentos para generar el examen');
      }
      
      const documentContent = documents.map(doc => 
        `Documento: ${doc.title}\n${doc.content}`
      ).join('\n\n');
      
      console.log(`📄 Longitud total del contenido: ${documentContent.length} caracteres`);
      
      // Crear el prompt para Gemini con instrucciones más claras
      const prompt = `
        Eres un experto en educación y evaluación. Necesito que generes un examen basado en el contenido de un curso.
        
        Información del examen:
        - ID del curso: ${courseId}
        - Número de preguntas: ${questionCount}
        - Tipos de preguntas: ${questionTypes.join(', ')}
        
        Basándote en el siguiente contenido del curso, genera ${questionCount} preguntas de examen.
        Para preguntas de opción múltiple, incluye 4 opciones y marca la correcta.
        Para preguntas de verdadero/falso, indica si la afirmación es verdadera o falsa.
        
        Contenido del curso:
        ${documentContent}
        
        MUY IMPORTANTE: Responde ÚNICAMENTE con el array JSON, sin formateo adicional, sin backticks, sin comentarios, sin ningún texto extra antes o después. Solo el JSON crudo:
        
        [
          {
            "content": "Texto de la pregunta",
            "type": "MULTIPLE_CHOICE",
            "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
            "answer": "Opción correcta",
            "explanation": "Explicación de la respuesta correcta",
            "points": 1
          }
        ]
      `;
      
      console.log('📤 Enviando prompt a Gemini API...');
      console.log(`🔑 API Key utilizada: ${this.apiKey.substring(0, 5)}...${this.apiKey.substring(this.apiKey.length - 3)}`);
      
      // Llamar a la API de Gemini
      const response = await this._callGeminiAPI(prompt, 0.7);
      console.log('📥 Respuesta recibida de Gemini API');
      
      try {
        // Limpiar la respuesta de posibles caracteres adicionales
        let cleanedResponse = response.trim();
        
        // Eliminar backticks y bloque de código si existen
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        
        // Intentar parsear la respuesta limpia
        const jsonResponse = JSON.parse(cleanedResponse);
        console.log(`✅ Examen generado con ${jsonResponse.length || 0} preguntas`);
        
        // Verificar que el JSON tiene la estructura esperada
        if (!Array.isArray(jsonResponse)) {
          console.error('❌ La respuesta JSON no es un array de preguntas', jsonResponse);
          throw new Error('La respuesta JSON no tiene la estructura esperada');
        }
        
        return jsonResponse;
      } catch (parseError) {
        console.error('❌ Error al parsear la respuesta JSON inicial:', parseError);
        console.log('📄 Respuesta recibida:', response.substring(0, 500) + '...');
        
        // Intentar múltiples estrategias para extraer JSON
        const strategies = [
          // Buscar cualquier cosa entre corchetes
          response.match(/\[[\s\S]*\]/),
          // Buscar específicamente después de marcadores comunes
          response.match(/```json\s*([\s\S]*?)```/),
          response.match(/```\s*([\s\S]*?)```/),
          response.match(/json\s*\[[\s\S]*\]/),
          // Intentar desde el primer carácter [ hasta el último ]
          (response.indexOf('[') >= 0 && response.lastIndexOf(']') >= 0) ? 
            response.substring(response.indexOf('['), response.lastIndexOf(']')+1) : null
        ];
        
        // Intentar cada estrategia
        for (const match of strategies) {
          if (match) {
            try {
              const content = typeof match === 'string' ? match : match[1] || match[0];
              const extractedJson = JSON.parse(content);
              console.log('📑 JSON extraído correctamente de la respuesta usando estrategia alternativa');
              
              // Verificar que el JSON extraído tiene la estructura esperada
              if (Array.isArray(extractedJson)) {
                return extractedJson;
              } else {
                console.error('❌ El JSON extraído no es un array válido', extractedJson);
              }
            } catch (err) {
              // Continuar con la siguiente estrategia
            }
          }
        }
        
        // Si todas las estrategias fallan, lanzar error
        throw new Error('No se pudo obtener un JSON válido de la respuesta de la API. Compruebe que la API key sea válida y tenga permisos suficientes.');
      }
    } catch (error) {
      console.error('❌ Error al generar el examen:', error);
      throw new Error(`Error al generar el examen: ${error.message}`);
    }
  }

  async evaluateProgress(courseId, examAttempts) {
    try {
      console.log(`Evaluando progreso para curso ${courseId} con ${examAttempts.length} intentos`);
      
      // Crear el prompt para Gemini
      const prompt = `
        Eres un experto en educación y análisis de rendimiento académico. Necesito que evalúes el progreso de un estudiante en un curso.
        
        Información del curso:
        - ID del curso: ${courseId}
        
        Intentos de exámenes:
        ${JSON.stringify(examAttempts, null, 2)}
        
        Basándote en estos intentos de exámenes, proporciona:
        1. Un análisis del rendimiento general
        2. Identificación de áreas de fortaleza
        3. Identificación de áreas que necesitan mejora
        4. Recomendaciones específicas para mejorar
        
        Responde en formato JSON con la siguiente estructura:
        {
          "overallPerformance": "Descripción del rendimiento general",
          "strengths": ["Área de fortaleza 1", "Área de fortaleza 2"],
          "areasToImprove": ["Área a mejorar 1", "Área a mejorar 2"],
          "recommendations": ["Recomendación 1", "Recomendación 2"]
        }
      `;
      
      // Llamar a la API de Gemini
      const response = await this._callGeminiAPI(prompt, 0.7);
      
      try {
        // Parsear la respuesta JSON
        const jsonResponse = JSON.parse(response);
        console.log('Evaluación de progreso generada correctamente');
        return jsonResponse;
      } catch (parseError) {
        console.error('Error al parsear la respuesta JSON:', parseError);
        console.log('Respuesta recibida:', response);
        
        // Intentar extraer solo la parte JSON de la respuesta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            console.log('JSON extraído correctamente de la respuesta');
            return extractedJson;
          } catch (extractError) {
            console.error('Error al extraer JSON de la respuesta:', extractError);
            throw new Error('No se pudo parsear la respuesta de la API');
          }
        } else {
          throw new Error('No se pudo extraer JSON de la respuesta de la API');
        }
      }
    } catch (error) {
      console.error('Error al evaluar el progreso:', error);
      throw new Error(`Error al evaluar el progreso: ${error.message}`);
    }
  }

  async indexDocument(document) {
    try {
      console.log(`Indexando documento ${document.id}: ${document.title}`);
      
      // En una implementación real, aquí se realizaría la indexación con FAISS
      // Para esta implementación, simularemos el proceso
      
      // Dividir el contenido en chunks
      const chunks = this._preprocessAndChunk(document.content);
      
      // Simular la creación de embeddings y almacenamiento
      const indexPath = path.join(process.cwd(), 'data', 'indexes', `${document.id}.json`);
      
      // Asegurar que el directorio existe
      const indexDir = path.dirname(indexPath);
      if (!fs.existsSync(indexDir)) {
        fs.mkdirSync(indexDir, { recursive: true });
      }
      
      // Guardar información de indexación
      const indexInfo = {
        documentId: document.id,
        documentTitle: document.title,
        chunkCount: chunks.length,
        chunks: chunks,
        indexedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(indexPath, JSON.stringify(indexInfo, null, 2));
      
      console.log(`Documento indexado correctamente: ${indexPath}`);
      
      return {
        documentId: document.id,
        indexPath: indexPath,
        chunkCount: chunks.length
      };
    } catch (error) {
      console.error('Error al indexar el documento:', error);
      throw new Error(`Error al indexar el documento: ${error.message}`);
    }
  }
  
  _preprocessAndChunk(text, chunkSize = 1000, overlapSize = 200) {
    // Dividir el texto en chunks con solapamiento
    const chunks = [];
    let startIndex = 0;
    
    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      chunks.push({
        id: `chunk_${chunks.length}`,
        text: text.substring(startIndex, endIndex)
      });
      
      startIndex += chunkSize - overlapSize;
    }
    
    return chunks;
  }
}

module.exports = GeminiAIService;
