// Test para el componente StudyPlan
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudyPlan from '../pages/StudyPlan';
import { courseService, documentService, studyPlanService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  courseService: {
    getCourseById: jest.fn()
  },
  documentService: {
    getDocumentsByCourse: jest.fn()
  },
  studyPlanService: {
    generateStudyPlan: jest.fn()
  }
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

describe('StudyPlan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el estado de carga inicialmente', () => {
    courseService.getCourseById.mockResolvedValue({});
    documentService.getDocumentsByCourse.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <StudyPlan />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('muestra advertencia cuando no hay documentos', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    documentService.getDocumentsByCourse.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <StudyPlan />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/No hay documentos disponibles/i)).toBeInTheDocument();
    });
  });

  test('permite generar plan de estudio cuando hay documentos', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    documentService.getDocumentsByCourse.mockResolvedValue([
      { id: '1', title: 'Documento 1' }
    ]);
    
    render(
      <BrowserRouter>
        <StudyPlan />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Generar Plan de Estudio')).toBeInTheDocument();
    });
  });

  test('genera plan de estudio al hacer clic en el botón', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    documentService.getDocumentsByCourse.mockResolvedValue([
      { id: '1', title: 'Documento 1' }
    ]);
    
    const mockPlan = {
      sessions: [
        {
          title: 'Sesión 1',
          description: 'Descripción de la sesión 1',
          startDate: new Date().toISOString(),
          duration: 60,
          topics: [
            { title: 'Tema 1', content: 'Contenido del tema 1', priority: 1 }
          ]
        }
      ]
    };
    
    studyPlanService.generateStudyPlan.mockResolvedValue(mockPlan);
    
    render(
      <BrowserRouter>
        <StudyPlan />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const button = screen.getByText('Generar Plan de Estudio');
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(studyPlanService.generateStudyPlan).toHaveBeenCalled();
      expect(screen.getByText('Tu Plan de Estudio Personalizado')).toBeInTheDocument();
      expect(screen.getByText('Sesión 1')).toBeInTheDocument();
    });
  });
});
