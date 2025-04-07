// Test para el componente ExamList
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExamList from '../pages/ExamList';
import { courseService, examService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  courseService: {
    getCourseById: jest.fn()
  },
  examService: {
    generateExam: jest.fn()
  }
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

describe('ExamList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el estado de carga inicialmente', () => {
    courseService.getCourseById.mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <ExamList />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay exámenes', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    
    render(
      <BrowserRouter>
        <ExamList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No hay exámenes disponibles')).toBeInTheDocument();
    });
  });

  test('abre el modal al hacer clic en "Nuevo Examen"', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    
    render(
      <BrowserRouter>
        <ExamList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const button = screen.getByText('Nuevo Examen');
      fireEvent.click(button);
    });
    
    expect(screen.getByText('Crear Nuevo Examen')).toBeInTheDocument();
  });

  test('crea un nuevo examen al enviar el formulario', async () => {
    courseService.getCourseById.mockResolvedValue({ id: '1', title: 'Curso de Prueba' });
    examService.generateExam.mockResolvedValue({ 
      exam: { id: '1', title: 'Examen de Prueba' },
      questions: []
    });
    
    // Mock para window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: jest.fn() };
    
    render(
      <BrowserRouter>
        <ExamList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const button = screen.getByText('Nuevo Examen');
      fireEvent.click(button);
    });
    
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Examen de Prueba' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción del examen' } });
    
    fireEvent.click(screen.getByText('Crear Examen'));
    
    await waitFor(() => {
      expect(examService.generateExam).toHaveBeenCalled();
    });
    
    // Restaurar window.location
    window.location = originalLocation;
  });
});
