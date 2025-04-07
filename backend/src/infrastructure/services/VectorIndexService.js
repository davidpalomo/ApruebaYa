// Implementación del motor RAG con LRUCache en lugar de FAISS
const { LRUCache } = require('lru-cache');
const fs = require('fs');
const path = require('path');

class VectorIndexService {
  constructor() {
    // Usar LRUCache como alternativa a FAISS para almacenar vectores
    this.vectorStore = new LRUCache({
      max: 1000, // Máximo número de documentos en caché
      ttl: 1000 * 60 * 60 * 24 // TTL de 24 horas
    });
    
    this.indexDir = path.join(process.cwd(), 'data', 'indexes');
    
    // Asegurar que el directorio de índices existe
    if (!fs.existsSync(this.indexDir)) {
      fs.mkdirSync(this.indexDir, { recursive: true });
    }
  }
  
  async addDocument(document, chunks) {
    console.log(`Añadiendo documento ${document.id} al índice vectorial`);
    
    // Simular la creación de embeddings para cada chunk
    const indexedChunks = chunks.map((chunk, index) => {
      // Simular un vector de embedding (en una implementación real, esto vendría de un modelo)
      const mockEmbedding = new Array(128).fill(0).map(() => Math.random());
      
      return {
        id: `${document.id}_chunk_${index}`,
        text: chunk.text,
        embedding: mockEmbedding,
        metadata: {
          documentId: document.id,
          documentTitle: document.title,
          chunkIndex: index
        }
      };
    });
    
    // Guardar en el store
    this.vectorStore.set(document.id, indexedChunks);
    
    // Guardar en disco para persistencia
    const indexPath = path.join(this.indexDir, `${document.id}.json`);
    fs.writeFileSync(indexPath, JSON.stringify({
      documentId: document.id,
      documentTitle: document.title,
      chunks: indexedChunks.map(chunk => ({
        id: chunk.id,
        text: chunk.text,
        metadata: chunk.metadata
      }))
    }, null, 2));
    
    console.log(`Documento ${document.id} indexado correctamente con ${indexedChunks.length} chunks`);
    
    return {
      documentId: document.id,
      indexPath: indexPath,
      chunkCount: indexedChunks.length
    };
  }
  
  async search(query, topK = 5) {
    console.log(`Buscando: "${query}" (top ${topK})`);
    
    // En una implementación real, convertiríamos la consulta a un vector de embedding
    // y buscaríamos los chunks más similares
    
    // Para esta implementación, simularemos una búsqueda basada en coincidencia de texto
    const results = [];
    
    // Iterar sobre todos los documentos en el store
    for (const [documentId, chunks] of this.vectorStore.entries()) {
      // Buscar en cada chunk
      for (const chunk of chunks) {
        // Simular una puntuación de similitud basada en la presencia de palabras de la consulta
        const queryWords = query.toLowerCase().split(/\s+/);
        const textLower = chunk.text.toLowerCase();
        
        let matchCount = 0;
        for (const word of queryWords) {
          if (textLower.includes(word)) {
            matchCount++;
          }
        }
        
        // Calcular una puntuación de similitud simulada
        const similarity = matchCount / queryWords.length;
        
        if (similarity > 0) {
          results.push({
            id: chunk.id,
            text: chunk.text,
            metadata: chunk.metadata,
            similarity: similarity
          });
        }
      }
    }
    
    // Ordenar por similitud y tomar los top K
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    console.log(`Encontrados ${topResults.length} resultados para la consulta`);
    
    return topResults;
  }
  
  async getDocumentChunks(documentId) {
    // Obtener chunks de un documento específico
    return this.vectorStore.get(documentId) || [];
  }
  
  async deleteDocument(documentId) {
    console.log(`Eliminando documento ${documentId} del índice`);
    
    // Eliminar del store
    this.vectorStore.delete(documentId);
    
    // Eliminar archivo de índice
    const indexPath = path.join(this.indexDir, `${documentId}.json`);
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
    
    console.log(`Documento ${documentId} eliminado correctamente del índice`);
    
    return { success: true, documentId };
  }
}

module.exports = VectorIndexService;
