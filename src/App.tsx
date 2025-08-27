import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import StudentsListPage from './components/StudentsListPage';
import StudentCard from './components/StudentCard';
import ImportModal from './components/ImportModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { Student } from './types/Student';

type Page = 'welcome' | 'students' | 'student-card';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStudentsImported = (importedStudents: Student[]) => {
    setStudents(importedStudents);
    setShowImportModal(true);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('student-card');
  };

  const handleDeleteConfirmed = () => {
    setStudents([]);
    setShowDeleteModal(false);
    setCurrentPage('welcome');
    setSelectedStudent(null);
    setShowImportModal(false);
  };
  const navigateToStudents = () => {
    setCurrentPage('students');
    setShowImportModal(false);
  };

  const navigateToWelcome = () => {
    setCurrentPage('welcome');
    setSelectedStudent(null);
    setShowImportModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentPage === 'welcome' && (
        <WelcomePage 
          onStudentsImported={handleStudentsImported}
          onNavigateToStudents={() => setCurrentPage('students')}
          hasStudents={students.length > 0}
        />
      )}
      
      {currentPage === 'students' && (
        <StudentsListPage
          students={students}
          onStudentSelect={handleStudentSelect}
          onNavigateBack={navigateToWelcome}
          onDeleteStudents={() => setShowDeleteModal(true)}
        />
      )}
      
      {currentPage === 'student-card' && selectedStudent && (
        <StudentCard
          student={selectedStudent}
          onNavigateBack={() => setCurrentPage('students')}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setShowDeleteModal(false)}
          studentsCount={students.length}
        />
      )}
      {showImportModal && (
        <ImportModal
          onViewStudents={navigateToStudents}
          onClose={() => setShowImportModal(false)}
          studentsCount={students.length}
        />
      )}
    </div>
  );
}

export default App;