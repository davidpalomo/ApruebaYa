// Test para el componente Dashboard
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { courseService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  courseService: {
    getAllCourses: jest.fn()
  }
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el estado de carga inicialmente', () => {
    courseService.getAllCourses.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay cursos', async () => {
    courseService.getAllCourses.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No hay cursos disponibles')).toBeInTheDocument();
    });
  });

  test('muestra la lista de cursos cuando hay cursos disponibles', async () => {
    const mockCourses = [
      { id: '1', title: 'Curso 1', description: 'Descripción 1', createdAt: new Date().toISOString() },
      { id: '2', title: 'Curso 2', description: 'Descripción 2', createdAt: new Date().toISOString() }
    ];
    
    courseService.getAllCourses.mockResolvedValue(mockCourses);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Tus cursos recientes')).toBeInTheDocument();
      expect(screen.getByText('Curso 1')).toBeInTheDocument();
      expect(screen.getByText('Curso 2')).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error cuando falla la carga de cursos', async () => {
    courseService.getAllCourses.mockRejectedValue(new Error('Error al cargar cursos'));
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los cursos/i)).toBeInTheDocument();
    });
  });
});
