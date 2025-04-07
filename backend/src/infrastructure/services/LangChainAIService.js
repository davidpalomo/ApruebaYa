const { LRUCache } = require('lru-cache');

class LangChainAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.cache = new LRUCache({
      max: 500,
      ttl: 1000 * 60 * 60 // 1 hour
    });
  }

  async createVectorStore(documentContent, documentId) {
    try {
      // Simulamos la creación de un vector store usando LRU-Cache en lugar de hnswlib-node
      const vectorKey = `vector_${documentId}`;
      this.cache.set(vectorKey, {
        content: documentContent,
        vectors: this._simulateVectorization(documentContent),
        timestamp: Date.now()
      });
      
      return {
        id: vectorKey,
        documentId: documentId,
        status: 'success'
      };
    } catch (error) {
      console.error('Error creating vector store:', error);
      throw new Error('Failed to create vector store');
    }
  }

  async generateStudyPlan(courseId, documents) {
    try {
      // Simulamos la generación de un plan de estudio usando los documentos vectorizados
      const topics = [];
      
      for (const doc of documents) {
        const vectorKey = `vector_${doc.id}`;
        const vectorData = this.cache.get(vectorKey);
        
        if (vectorData) {
          // Extraer temas del contenido vectorizado
          const extractedTopics = this._extractTopicsFromContent(vectorData.content);
          topics.push(...extractedTopics);
        }
      }
      
      // Organizar temas en sesiones
      const sessions = this._organizeTopicsIntoSessions(topics);
      
      return {
        courseId,
        sessions,
        status: 'success'
      };
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw new Error('Failed to generate study plan');
    }
  }

  async generateExam(courseId, documents, options = {}) {
    try {
      const questionCount = options.questionCount || 10;
      const questions = [];
      
      for (const doc of documents) {
        const vectorKey = `vector_${doc.id}`;
        const vectorData = this.cache.get(vectorKey);
        
        if (vectorData) {
          // Generar preguntas basadas en el contenido
          const generatedQuestions = this._generateQuestionsFromContent(
            vectorData.content, 
            Math.ceil(questionCount / documents.length)
          );
          questions.push(...generatedQuestions);
        }
      }
      
      return {
        courseId,
        title: options.title || 'Examen generado',
        description: options.description || 'Examen generado automáticamente',
        questions: questions.slice(0, questionCount),
        status: 'success'
      };
    } catch (error) {
      console.error('Error generating exam:', error);
      throw new Error('Failed to generate exam');
    }
  }

  async generateSummary(documentContent) {
    try {
      // Simulamos la generación de un resumen
      const sentences = documentContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summaryLength = Math.max(3, Math.floor(sentences.length * 0.2));
      const summary = sentences.slice(0, summaryLength).join('. ') + '.';
      
      return {
        summary,
        status: 'success'
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  // Métodos privados de utilidad
  
  _simulateVectorization(content) {
    // Simulamos la vectorización del contenido
    return {
      dimensions: 128,
      count: content.length,
      timestamp: Date.now()
    };
  }
  
  _extractTopicsFromContent(content) {
    // Simulamos la extracción de temas del contenido
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const topics = [];
    
    for (let i = 0; i < sentences.length; i += 5) {
      if (i < sentences.length) {
        topics.push({
          title: sentences[i].trim().substring(0, 50) + (sentences[i].length > 50 ? '...' : ''),
          content: sentences.slice(i, Math.min(i + 5, sentences.length)).join('. ') + '.',
          priority: Math.floor(Math.random() * 5) + 1
        });
      }
    }
    
    return topics;
  }
  
  _organizeTopicsIntoSessions(topics) {
    // Simulamos la organización de temas en sesiones
    const sessions = [];
    const topicsPerSession = Math.max(1, Math.ceil(topics.length / 3));
    
    for (let i = 0; i < topics.length; i += topicsPerSession) {
      const sessionTopics = topics.slice(i, Math.min(i + topicsPerSession, topics.length));
      
      sessions.push({
        title: `Sesión ${sessions.length + 1}`,
        description: `Sesión de estudio con ${sessionTopics.length} temas`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7200000), // 2 horas después
        duration: 120, // 2 horas en minutos
        topics: sessionTopics
      });
    }
    
    return sessions;
  }
  
  _generateQuestionsFromContent(content, count) {
    // Simulamos la generación de preguntas basadas en el contenido
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const questions = [];
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
      
      if (sentence.length > 10) {
        const words = sentence.split(' ');
        const questionType = Math.random() > 0.5 ? 'MULTIPLE_CHOICE' : 'TRUE_FALSE';
        
        if (questionType === 'MULTIPLE_CHOICE') {
          questions.push({
            content: `¿Cuál de las siguientes opciones completa correctamente la frase: "${sentence.replace(words[words.length - 1], '___')}"?`,
            type: 'MULTIPLE_CHOICE',
            options: JSON.stringify({
              a: words[words.length - 1],
              b: 'opción incorrecta 1',
              c: 'opción incorrecta 2',
              d: 'opción incorrecta 3'
            }),
            answer: 'a',
            explanation: `La respuesta correcta es "${words[words.length - 1]}" porque completa correctamente la frase original.`,
            points: 1
          });
        } else {
          questions.push({
            content: `¿Es correcta la siguiente afirmación?: "${sentence}"`,
            type: 'TRUE_FALSE',
            options: JSON.stringify({
              a: 'Verdadero',
              b: 'Falso'
            }),
            answer: 'a',
            explanation: `La afirmación es correcta según el contenido del documento.`,
            points: 1
          });
        }
      }
    }
    
    return questions;
  }
}

module.exports = LangChainAIService;
