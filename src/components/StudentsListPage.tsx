import React, { useState, useMemo } from 'react';
import { ArrowRight, Search, Filter, Users, User, Trash2 } from 'lucide-react';
import { Student } from '../types/Student';

interface StudentsListPageProps {
  students: Student[];
  onStudentSelect: (student: Student) => void;
  onNavigateBack: () => void;
  onDeleteStudents: () => void;
}

export default function StudentsListPage({ students, onStudentSelect, onNavigateBack, onDeleteStudents }: StudentsListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.id.includes(searchTerm);
      const matchesLevel = !levelFilter || student.level === levelFilter;
      const matchesSection = !sectionFilter || student.section === sectionFilter;
      const matchesGroup = !groupFilter || student.group === groupFilter;

      return matchesSearch && matchesLevel && matchesSection && matchesGroup;
    });
  }, [students, searchTerm, levelFilter, sectionFilter, groupFilter]);

  const uniqueLevels = [...new Set(students.map(s => s.level))].sort();
  const uniqueSections = [...new Set(students.map(s => s.section))].sort();
  const uniqueGroups = [...new Set(students.map(s => s.group))].sort();

  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('');
    setSectionFilter('');
    setGroupFilter('');
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateBack}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">معاينة اللوائح</h1>
                <p className="text-gray-600 mt-1">إدارة وفلترة قوائم التلاميذ</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Users className="w-5 h-5" />
                  <span>{filteredStudents.length} من {students.length}</span>
                </div>
              </div>
              
              <button
                onClick={onDeleteStudents}
                className="bg-red-100 hover:bg-red-200 p-3 rounded-xl transition-colors duration-200 group"
                title="حذف جميع اللوائح"
              >
                <Trash2 className="w-6 h-6 text-red-600 group-hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">البحث والفلترة</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث بالاسم أو الرمز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">جميع المستويات</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">جميع الأقسام</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>

            {/* Group Filter */}
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">جميع الأفواج</option>
              {uniqueGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {(searchTerm || levelFilter || sectionFilter || groupFilter) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              إزالة جميع الفلاتر
            </button>
          )}
        </div>

        {/* Students Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => onStudentSelect(student)}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 group-hover:bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {student.fullName}
                  </h3>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">الرمز:</span>
                      <span className="font-medium text-gray-700">{student.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المستوى:</span>
                      <span className="font-medium text-gray-700">{student.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">القسم:</span>
                      <span className="font-medium text-gray-700">{student.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">الفوج:</span>
                      <span className="font-medium text-gray-700">{student.group}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="bg-gray-50 group-hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600 group-hover:text-blue-600">انقر لعرض البطاقة</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">لم يتم العثور على تلاميذ يطابقون معايير البحث الحالية</p>
          </div>
        )}
      </main>
    </div>
  );
}