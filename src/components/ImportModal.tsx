import React from 'react';
import { CheckCircle, Eye, X, Users } from 'lucide-react';

interface ImportModalProps {
  onViewStudents: () => void;
  onClose: () => void;
  studentsCount: number;
}

export default function ImportModal({ onViewStudents, onClose, studentsCount }: ImportModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-pulse">
        <div className="text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تم الاستيراد بنجاح!</h2>
          <p className="text-gray-600 mb-2">تم استيراد بيانات التلاميذ بنجاح</p>
          <div className="bg-blue-50 rounded-lg p-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
              <Users className="w-5 h-5" />
              <span>{studentsCount} تلميذ(ة)</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onViewStudents}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              معاينة اللوائح
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              عودة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}