
import React from 'react';

interface SuggestedQuestionsProps {
  onSendQuestion: (question: string) => void;
}

const questions = [
  '❓ What are your key features?',
  '💰 How do you handle multi-currency consolidation?',
  '🔎 Where can I learn more about Finalyzer?',
  '🧾 What reporting formats do you support?',
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSendQuestion }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {questions.map((question, index) => (
        <button
          key={index}
          className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-[#4A90E2] hover:shadow-md active:scale-95 transition-all duration-200 ease-in-out text-gray-700"
          onClick={() => onSendQuestion(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
