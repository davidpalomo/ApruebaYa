// Puerto para el servicio de IA
class AIService {
  async generateStudySession(courseId, documentIds, duration) {
    throw new Error('Method not implemented');
  }
  
  async generateExam(courseId, documentIds, questionCount, questionTypes) {
    throw new Error('Method not implemented');
  }
  
  async evaluateProgress(courseId, examAttempts) {
    throw new Error('Method not implemented');
  }
  
  async indexDocument(document) {
    throw new Error('Method not implemented');
  }
}

module.exports = AIService;
