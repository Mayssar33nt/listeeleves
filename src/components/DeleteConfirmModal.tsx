import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, Users } from 'lucide-react';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  studentsCount: number;
}

export default function DeleteConfirmModal({ onConfirm, onCancel, studentsCount }: DeleteConfirmModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    if (confirmText === 'Almoutanabi') {
      setIsDeleting(true);
      setTimeout(() => {
        onConfirm();
        setIsDeleting(false);
      }, 1000);
    }
  };

  const isConfirmValid = confirmText === 'Almoutanabi';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-pulse">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">تأكيد حذف اللوائح</h2>
          <p className="text-gray-600 mb-2">هذا الإجراء سيحذف جميع بيانات التلاميذ نهائياً</p>
          
          <div className="bg-red-50 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
              <Users className="w-5 h-5" />
              <span>{studentsCount} تلميذ(ة) سيتم حذفهم</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              لتأكيد الحذف، اكتب <strong className="text-red-600">Almoutanabi</strong> في الحقل أدناه:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="اكتب Almoutanabi للتأكيد"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-center"
              disabled={isDeleting}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-red-500 text-sm mt-2">النص المدخل غير صحيح</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              disabled={!isConfirmValid || isDeleting}
              className={`flex-1 ${
                isConfirmValid && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <Trash2 className="w-5 h-5" />
              {isDeleting ? 'جاري الحذف...' : 'حذف اللوائح'}
            </button>
            
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              إلغاء
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه
          </div>
        </div>
      </div>
    </div>
  );
}