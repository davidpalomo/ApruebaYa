// Test para el componente DocumentUpload
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentUpload from '../pages/DocumentUpload';
import { documentService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  documentService: {
    uploadDocument: jest.fn()
  }
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn()
}));

describe('DocumentUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario de carga de documentos', () => {
    render(
      <BrowserRouter>
        <DocumentUpload />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Subir Documento')).toBeInTheDocument();
    expect(screen.getByLabelText('Título del documento')).toBeInTheDocument();
    expect(screen.getByText('Arrastra y suelta un archivo aquí, o')).toBeInTheDocument();
  });

  test('muestra error cuando se intenta subir sin archivo', async () => {
    render(
      <BrowserRouter>
        <DocumentUpload />
      </BrowserRouter>
    );
    
    const submitButton = screen.getByText('Subir Documento');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor, selecciona un archivo para subir.')).toBeInTheDocument();
    });
  });

  test('muestra error cuando se intenta subir sin título', async () => {
    render(
      <BrowserRouter>
        <DocumentUpload />
      </BrowserRouter>
    );
    
    // Simular que hay un archivo seleccionado
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('selecciona un archivo');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Borrar el título
    const titleInput = screen.getByLabelText('Título del documento');
    fireEvent.change(titleInput, { target: { value: '' } });
    
    const submitButton = screen.getByText('Subir Documento');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor, ingresa un título para el documento.')).toBeInTheDocument();
    });
  });

  test('sube el documento correctamente', async () => {
    documentService.uploadDocument.mockResolvedValue({ id: '1', title: 'Test Document' });
    
    render(
      <BrowserRouter>
        <DocumentUpload />
      </BrowserRouter>
    );
    
    // Simular que hay un archivo seleccionado
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('selecciona un archivo');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    // Establecer el título
    const titleInput = screen.getByLabelText('Título del documento');
    fireEvent.change(titleInput, { target: { value: 'Test Document' } });
    
    const submitButton = screen.getByText('Subir Documento');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(documentService.uploadDocument).toHaveBeenCalled();
    });
  });
});
