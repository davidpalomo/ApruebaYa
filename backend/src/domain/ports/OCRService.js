// Puerto para el servicio OCR
class OCRService {
  async processDocument(filePath) {
    throw new Error('Method not implemented');
  }
  
  async extractTextFromPDF(filePath) {
    throw new Error('Method not implemented');
  }
  
  async extractTextFromImage(imagePath) {
    throw new Error('Method not implemented');
  }
}

module.exports = OCRService;
