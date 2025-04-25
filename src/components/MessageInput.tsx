
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 max-w-full px-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 text-base md:text-sm rounded-lg border 
          focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent
          transition-all duration-200 ease-in-out"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={`p-2 rounded-lg transition-all duration-200 ease-in-out transform
          ${message.trim() && !isLoading
            ? 'bg-[#4A90E2] text-white hover:bg-[#357ABD] hover:shadow-lg active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        <Send size={20} className="transform transition-transform duration-200 ease-in-out hover:scale-110" />
      </button>
    </form>
  );
};

export default MessageInput;
