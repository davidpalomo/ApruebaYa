// Archivo principal de la aplicación
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import DocumentUpload from './pages/DocumentUpload';
import StudyPlan from './pages/StudyPlan';
import ExamList from './pages/ExamList';
import ExamDetail from './pages/ExamDetail';
import TakeExam from './pages/TakeExam';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="courses/:id/upload" element={<DocumentUpload />} />
        <Route path="courses/:id/study-plan" element={<StudyPlan />} />
        <Route path="courses/:id/exams" element={<ExamList />} />
        <Route path="exams/:id" element={<ExamDetail />} />
        <Route path="exams/:id/take" element={<TakeExam />} />
      </Route>
    </Routes>
  );
}

export default App;
