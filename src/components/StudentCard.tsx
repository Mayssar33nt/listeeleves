import React, { useRef } from 'react';
import { ArrowRight, User, Printer, Copy, MessageCircle, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student } from '../types/Student';

interface StudentCardProps {
  student: Student;
  onNavigateBack: () => void;
}

export default function StudentCard({ student, onNavigateBack }: StudentCardProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create a clone of the element for PDF generation
      const element = printRef.current;
      
      // Generate canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit the page with margins
      const margin = 20;
      const maxWidth = pdfWidth - (margin * 2);
      const maxHeight = pdfHeight - (margin * 2);
      
      let finalWidth = maxWidth;
      let finalHeight = (imgHeight * maxWidth) / imgWidth;
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (imgWidth * maxHeight) / imgHeight;
      }
      
      // Center the image
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
      // Save the PDF
      pdf.save(`بطاقة_${student.fullName}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `
الاسم الكامل: ${student.fullName}
رمز التلميذ(ة): ${student.id}
المستوى: ${student.level}
القسم: ${student.section}
الفوج: ${student.group}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('تعذر نسخ البيانات');
    }
  };

  const shareToWhatsApp = () => {
    const text = `
*بطاقة التلميذ(ة)*

الاسم الكامل: ${student.fullName}
رمز التلميذ(ة): ${student.id}
المستوى: ${student.level}
القسم: ${student.section}
الفوج: ${student.group}
    `.trim();

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateBack}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200"
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </button>
            <img 
              src="/logo mutanabi.png" 
              alt="شعار مدرسة المتنبي" 
              className="w-10 h-10 rounded-lg shadow-md object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">بطاقة التلميذ(ة)</h1>
              <p className="text-gray-600 mt-1">المعلومات التفصيلية للتلميذ(ة)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Student Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div ref={printRef} className="p-8">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -m-8 mb-8 p-8 text-white">
              <div className="flex items-center gap-6">
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{student.fullName}</h2>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg inline-block">
                    <span className="text-white font-medium">رمز التلميذ(ة): {student.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات الأساسية</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">الاسم الكامل:</span>
                      <span className="font-bold text-gray-900">{student.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">رمز التلميذ(ة):</span>
                      <span className="font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-lg">{student.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات الأكاديمية</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">المستوى:</span>
                      <span className="font-bold text-gray-900 bg-green-100 px-3 py-1 rounded-lg">{student.level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">القسم:</span>
                      <span className="font-bold text-gray-900 bg-purple-100 px-3 py-1 rounded-lg">{student.section}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">الفوج:</span>
                      <span className="font-bold text-gray-900 bg-orange-100 px-3 py-1 rounded-lg">{student.group}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص البطاقة</h3>
              <p className="text-gray-700 leading-relaxed">
                هذه بطاقة التلميذ(ة) <strong>{student.fullName}</strong> برمز <strong>{student.id}</strong>، 
                المسجل(ة) في المستوى <strong>{student.level}</strong> بقسم <strong>{student.section}</strong> 
                ضمن الفوج <strong>{student.group}</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handlePrint}
                disabled={isGeneratingPDF}
                className={`${isGeneratingPDF ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
              >
                <Printer className="w-5 h-5" />
                {isGeneratingPDF ? 'جاري الإنشاء...' : 'تصدير PDF'}
              </button>
              
              <button
                onClick={copyToClipboard}
                className={`${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'تم النسخ!' : 'نسخ المعلومات'}
              </button>
              
              <button
                onClick={shareToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                إرسال لواتساب
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}