// Test para el componente CourseList
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseList from '../pages/CourseList';
import { courseService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  courseService: {
    getAllCourses: jest.fn(),
    createCourse: jest.fn(),
    deleteCourse: jest.fn()
  }
}));

describe('CourseList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el estado de carga inicialmente', () => {
    courseService.getAllCourses.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay cursos', async () => {
    courseService.getAllCourses.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <CourseList />
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
        <CourseList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Curso 1')).toBeInTheDocument();
      expect(screen.getByText('Curso 2')).toBeInTheDocument();
    });
  });

  test('abre el modal al hacer clic en "Nuevo Curso"', async () => {
    courseService.getAllCourses.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const button = screen.getByText('Nuevo Curso');
      fireEvent.click(button);
    });
    
    expect(screen.getByText('Crear Nuevo Curso')).toBeInTheDocument();
  });

  test('crea un nuevo curso al enviar el formulario', async () => {
    courseService.getAllCourses.mockResolvedValue([]);
    courseService.createCourse.mockResolvedValue({ id: '3', title: 'Nuevo Curso', description: 'Nueva Descripción' });
    
    render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const button = screen.getByText('Nuevo Curso');
      fireEvent.click(button);
    });
    
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nuevo Curso' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Nueva Descripción' } });
    
    fireEvent.click(screen.getByText('Crear Curso'));
    
    await waitFor(() => {
      expect(courseService.createCourse).toHaveBeenCalledWith({
        title: 'Nuevo Curso',
        description: 'Nueva Descripción'
      });
    });
  });
});
