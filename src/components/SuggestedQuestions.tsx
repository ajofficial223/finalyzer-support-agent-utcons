
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
    // Add scroll hint indicator
    const container = scrollContainerRef.current;
    if (container) {
      // Check if scrollable
      const isScrollable = container.scrollWidth > container.clientWidth;
      if (isScrollable) {
        // Add subtle animation to indicate scrollability
        container.classList.add('pulse-right');
      }
    }
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Remove animation once user starts scrolling
      container.classList.remove('pulse-right');
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-2 hide-scrollbar"
        onScroll={handleScroll}
      >
        <div className="flex gap-2 px-2 snap-x snap-mandatory">
          {questions.map((question, index) => (
            <button
              key={index}
              className="shrink-0 snap-center px-3 py-1 text-sm bg-white border border-gray-200 
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
          
          /* Subtle animation to indicate scrollability */
          @keyframes pulseRight {
            0%, 100% { box-shadow: 0 0 0 rgba(74, 144, 226, 0); }
            50% { box-shadow: 0 0 10px rgba(74, 144, 226, 0.3); }
          }
          .pulse-right {
            animation: pulseRight 2s ease-in-out infinite;
          }
          
          /* Add scroll indicators */
          .hide-scrollbar::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 30px;
            background: linear-gradient(to right, rgba(255,255,255,0), rgba(245,247,250,0.8));
            pointer-events: none;
            z-index: 10;
          }
        `
      }} />
    </div>
  );
};

export default SuggestedQuestions;
