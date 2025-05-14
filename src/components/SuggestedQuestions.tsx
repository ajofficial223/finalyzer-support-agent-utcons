import React, { useEffect, useRef } from 'react';

interface SuggestedQuestionsProps {
  onSendQuestion: (question: string) => void;
}

const questions = [
  '❓ What are your key features?',
  '💰 How do you handle multi-currency consolidation?',
  '🔎 Where can I learn more about Finalyzer?',
  '🧾 What reporting formats do you support?',
  '📊 Can you explain your analytics capabilities?',
  '🔄 How does the data refresh work?',
  '📱 Is there a mobile app available?',
  '🔐 What security features do you offer?'
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSendQuestion }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Add auto-scroll animation
      const autoScroll = () => {
        if (!container.matches(':hover')) {
          container.scrollLeft += 1;
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      };

      const scrollInterval = setInterval(autoScroll, 50);
      return () => clearInterval(scrollInterval);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-2 hide-scrollbar"
      >
        <div className="flex gap-2 px-2 min-w-full animate-scroll">
          {questions.map((question, index) => (
            <button
              key={index}
              className="shrink-0 whitespace-nowrap px-3 py-1 text-sm bg-white border border-gray-200 
                rounded-full hover:bg-gray-50 hover:border-[#4A90E2] hover:shadow-md 
                active:scale-95 transition-all duration-200 ease-in-out text-gray-700
                focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-opacity-50"
              onClick={() => onSendQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ 
        __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          @keyframes scrolling {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          .animate-scroll {
            animation: scrolling 20s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `
      }} />
    </div>
  );
};

export default SuggestedQuestions;
