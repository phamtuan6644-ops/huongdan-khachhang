import React, { useState } from 'react';
import { 
  KeyRound, 
  CreditCard, 
  Fingerprint, 
  ReceiptText, 
  CalendarClock, 
  ArrowLeft, 
  Youtube, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Maximize2, 
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquareHeart,
  HelpCircle
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface FaqSectionProps {
  onNavigateHome?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onNavigateHome }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'success' | 'unresolved' | 'ended'>('none');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const topics = contentData.faqSection.topics;
  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || null;

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentStepIndex(0);
    setFeedbackStatus('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('none');
  };

  const handleEndConversation = () => {
    setFeedbackStatus('ended');
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'quen-mat-khau':
        return <KeyRound className="w-6 h-6 text-[#00529C]" />;
      case 'dong-the':
        return <CreditCard className="w-6 h-6 text-[#00529C]" />;
      case 'sinh-trac-hoc':
        return <Fingerprint className="w-6 h-6 text-[#00529C]" />;
      case 'nop-thue':
        return <ReceiptText className="w-6 h-6 text-[#00529C]" />;
      case 'dat-lich':
        return <CalendarClock className="w-6 h-6 text-[#00529C]" />;
      default:
        return <HelpCircle className="w-6 h-6 text-[#00529C]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* If no topic selected, show topic selection cards */}
      {!selectedTopic ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#00529C] to-[#003366] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block text-xs uppercase tracking-wider font-bold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full mb-3 text-white">
                Hỗ trợ tại quầy 24/7
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                {contentData.faqSection.title}
              </h2>
              <p className="text-lg text-blue-100 font-medium">
                {contentData.faqSection.promptQuestion}
              </p>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#00529C]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getTopicIcon(topic.id)}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {topic.steps.length} bước
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00529C] transition-colors mb-2">
                    {index + 1}. {topic.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00529C]">
                  <span>Xem hướng dẫn chi tiết</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick contact box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6 text-[#ED1C24]" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Cần hỗ trợ trực tiếp từ Chuyên viên tư vấn?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  {contentData.faqSection.consultant.name} ({contentData.faqSection.consultant.role}) – Hotline: <strong>{contentData.faqSection.consultant.phone}</strong>
                </p>
              </div>
            </div>
            <a
              href={`tel:${contentData.faqSection.consultant.phone.replace(/[^0-9]/g, '')}`}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#ED1C24] hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi ngay {contentData.faqSection.consultant.phone}</span>
            </a>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step View for selected topic */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={handleBackToMenu}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#00529C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách câu hỏi</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Tiến độ:</span>
              <span className="text-xs font-bold text-[#00529C] bg-blue-50 px-2.5 py-1 rounded-md">
                Bước {currentStepIndex + 1} / {selectedTopic.steps.length}
              </span>
            </div>
          </div>

          {/* Active Topic Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  {getTopicIcon(selectedTopic.id)}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedTopic.title}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedTopic.summary}
                  </p>
                </div>
              </div>

              {selectedTopic.videoUrl && (
                <a
                  href={selectedTopic.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Xem Video trên YouTube</span>
                </a>
              )}
            </div>

            {/* Steps Progress Pills */}
            <div className="py-4 flex gap-1.5 overflow-x-auto no-scrollbar">
              {selectedTopic.steps.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? 'bg-[#00529C] text-white shadow-xs'
                      : idx < currentStepIndex
                      ? 'bg-blue-50 text-[#00529C] border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bước {st.step}
                </button>
              ))}
            </div>

            {/* Current Step Showcase */}
            {selectedTopic.steps[currentStepIndex] && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-start">
                {/* Step Text & Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/70 text-[#00529C] rounded-lg text-xs font-bold">
                    <span>HƯỚNG DẪN BƯỚC {selectedTopic.steps[currentStepIndex].step}</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                      {selectedTopic.steps[currentStepIndex].text}
                    </p>
                  </div>

                  {/* Navigation between steps */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                      disabled={currentStepIndex === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <button
                      onClick={() => setCurrentStepIndex(Math.min(selectedTopic.steps.length - 1, currentStepIndex + 1))}
                      disabled={currentStepIndex === selectedTopic.steps.length - 1}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#00529C] font-semibold text-xs sm:text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors cursor-pointer"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step Screenshot Illustration */}
                <div className="lg:col-span-7">
                  <div className="relative group bg-slate-100 border border-slate-200 rounded-2xl p-2 sm:p-4 overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                    <img
                      src={selectedTopic.steps[currentStepIndex].image}
                      alt={`Minh họa bước ${selectedTopic.steps[currentStepIndex].step}`}
                      className="max-h-[460px] w-auto object-contain rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-[1.01]"
                      onError={(e) => {
                        // In case image URL fails, gracefully display stylized mockup
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.img-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'img-fallback flex flex-col items-center justify-center p-8 text-center text-slate-500';
                          fallback.innerHTML = `<div class="w-12 h-12 rounded-full bg-blue-100 text-[#00529C] flex items-center justify-center font-bold mb-2">Ảnh ${selectedTopic.steps[currentStepIndex].step}</div><p class="text-sm font-medium">Hình ảnh màn hình minh họa bước ${selectedTopic.steps[currentStepIndex].step}</p>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />

                    {/* Zoom button */}
                    <button
                      onClick={() => setZoomedImage(selectedTopic.steps[currentStepIndex].image)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#00529C] p-2 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Xem phóng to hình ảnh"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Phóng to</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Confirmation Area */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 text-center">
              Khách hàng đã thực hiện ổn hay chưa?
            </h3>

            {feedbackStatus === 'none' && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setFeedbackStatus('success')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Đã ổn rồi</span>
                </button>

                <button
                  onClick={() => setFeedbackStatus('unresolved')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
              </div>
            )}

            {feedbackStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-4 animate-in fade-in duration-200">
                <div className="inline-flex p-2 bg-emerald-100 rounded-full text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">
                  Tuyệt vời! VietinBank rất vui khi đã hỗ trợ được Quý khách.
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleBackToMenu}
                    className="px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-sm transition-colors cursor-pointer"
                  >
                    Quay lại menu chính
                  </button>
                  <button
                    onClick={handleEndConversation}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {feedbackStatus === 'unresolved' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-[#00529C] rounded-lg shrink-0 mt-0.5">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                      {contentData.faqSection.feedbackMessages.notResolved}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-blue-100">
                  <a
                    href={`tel:${contentData.faqSection.consultant.phone.replace(/[^0-9]/g, '')}`}
                    className="px-5 py-2.5 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Gọi Chuyên viên Phạm Tuấn Dủ ({contentData.faqSection.consultant.phone})</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBackToMenu}
                      className="px-4 py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      Quay lại menu chính
                    </button>
                    <button
                      onClick={handleEndConversation}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              </div>
            )}

            {feedbackStatus === 'ended' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-blue-100 text-[#00529C] rounded-full flex items-center justify-center mx-auto">
                  <MessageSquareHeart className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#00529C]">
                  {contentData.faqSection.feedbackMessages.endChat}
                </h4>
                <p className="text-sm text-slate-600">
                  Quý khách có thể quay lại trang chủ bất cứ lúc nào để sử dụng thêm các tính năng khác.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleBackToMenu}
                    className="px-5 py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-sm transition-colors cursor-pointer"
                  >
                    Về màn hình chính
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer z-10"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Ảnh phóng to"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
