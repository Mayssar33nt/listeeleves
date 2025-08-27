import React, { useRef } from 'react';
import { GraduationCap, Download, Upload, Users, BookOpen, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student } from '../types/Student';

interface WelcomePageProps {
  onStudentsImported: (students: Student[]) => void;
  onNavigateToStudents: () => void;
  hasStudents: boolean;
}

export default function WelcomePage({ onStudentsImported, onNavigateToStudents, hasStudents }: WelcomePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateExcelTemplate = () => {
    const headers = ['رمز التلميذ(ة)', 'الاسم الكامل', 'المستوى', 'القسم', 'الفوج'];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    
    // Set RTL direction and Arabic formatting
    ws['!dir'] = 'rtl';
    ws['!cols'] = [
      { wch: 15 }, // رمز التلميذ
      { wch: 25 }, // الاسم الكامل
      { wch: 12 }, // المستوى
      { wch: 15 }, // القسم
      { wch: 12 }  // الفوج
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'قوائم التلاميذ');
    XLSX.writeFile(wb, 'نموذج_قوائم_التلاميذ.xlsx');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and process data
        const studentsData = (jsonData as string[][]).slice(1).filter(row => 
          row.length >= 5 && row[0] && row[1] && row[2] && row[3] && row[4]
        );

        const students: Student[] = studentsData.map((row, index) => ({
          id: String(index + 1),
          fullName: String(row[1]),
          level: String(row[2]),
          section: String(row[3]),
          group: String(row[4])
        }));

        onStudentsImported(students);
      } catch (error) {
        alert('خطأ في قراءة الملف. يرجى التأكد من تنسيق البيانات.');
        console.error('File parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">نظام إدارة تلاميذ/ات مدرسة المتنبي</h1>
              <p className="text-gray-600 mt-1">منصة عصرية لإدارة وفلترة بيانات التلاميذ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-4xl md:text-5xl font-bold mb-8 leading-tight py-2">
            مرحباً بك في نظام إدارة التلاميذ
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نظام متطور لإدارة بيانات التلاميذ بسهولة وفعالية. يمكنك تحميل نموذج Excel، تعبئته، ثم استيراده للاستفادة من أدوات البحث والفلترة المتقدمة.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            تعليمات الاستخدام
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">الخطوة الأولى</h3>
              <p className="text-gray-600">قم بتحميل نموذج Excel الفارغ واملأه ببيانات التلاميذ</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">الخطوة الثانية</h3>
              <p className="text-gray-600">استورد ملف Excel المعبأ إلى النظام</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">الخطوة الثالثة</h3>
              <p className="text-gray-600">ابحث وفلتر التلاميذ واطلع على بطاقاتهم التفصيلية</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">تحميل النموذج</h3>
              <p className="text-gray-600 mb-6">احصل على نموذج Excel فارغ لإدخال بيانات التلاميذ</p>
              <button
                onClick={generateExcelTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
              >
                <Download className="w-5 h-5" />
                تحميل نموذج الإدخال
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">استيراد اللوائح</h3>
              <p className="text-gray-600 mb-6">ارفع ملف Excel المعبأ لبدء إدارة بيانات التلاميذ</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
              >
                <Upload className="w-5 h-5" />
                استيراد اللوائح
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Quick Access to Students */}
        {hasStudents && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">معاينة اللوائح</h3>
            <p className="text-indigo-100 mb-6">تم تحميل البيانات بنجاح. يمكنك الآن معاينة وإدارة قوائم التلاميذ</p>
            <button
              onClick={onNavigateToStudents}
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              معاينة اللوائح
            </button>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">فلترة متقدمة</h4>
            <p className="text-gray-600 text-sm">فلتر التلاميذ حسب المستوى، القسم، والفوج</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">بطاقات تفصيلية</h4>
            <p className="text-gray-600 text-sm">اطلع على بطاقة مفصلة لكل تلميذ مع إمكانية الطباعة</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">مشاركة سهلة</h4>
            <p className="text-gray-600 text-sm">انسخ المعلومات أو شاركها عبر واتساب</p>
          </div>
        </div>
      </main>
    </div>
  );
}