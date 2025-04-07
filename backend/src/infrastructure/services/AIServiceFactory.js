const AIService = require('../domain/ports/AIService');
const LangChainAIService = require('./services/LangChainAIService');
const GeminiAIService = require('./services/GeminiAIService');

/**
 * Factory para crear instancias de servicios de IA
 */
class AIServiceFactory {
  /**
   * Crea una instancia del servicio de IA apropiado según la configuración
   * @param {string} type - Tipo de servicio de IA ('langchain' o 'gemini')
   * @param {Object} config - Configuración del servicio
   * @returns {AIService} - Instancia del servicio de IA
   */
  static createAIService(type, config) {
    switch (type.toLowerCase()) {
      case 'langchain':
        return new LangChainAIService(config.apiKey);
      case 'gemini':
        return new GeminiAIService(config.apiKey);
      default:
        throw new Error(`Tipo de servicio de IA no soportado: ${type}`);
    }
  }

  /**
   * Crea una instancia del servicio de IA predeterminado
   * @param {Object} config - Configuración del servicio
   * @returns {AIService} - Instancia del servicio de IA
   */
  static createDefaultAIService(config) {
    // Por defecto, usamos Gemini si hay una API key disponible, de lo contrario LangChain
    if (config.geminiApiKey) {
      return this.createAIService('gemini', { apiKey: config.geminiApiKey });
    } else {
      return this.createAIService('langchain', { apiKey: null });
    }
  }
}

module.exports = AIServiceFactory;
