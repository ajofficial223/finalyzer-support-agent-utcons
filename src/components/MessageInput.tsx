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
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 max-w-full px-2">
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-5 py-3 text-base md:text-sm rounded-full 
            glass-effect focus:outline-none focus:ring-2 focus:ring-primary/50 
            focus:border-transparent transition-all duration-200 ease-in-out 
            shadow-md hover:shadow-lg"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={`p-3 rounded-full aspect-square flex items-center justify-center transition-all duration-200 ease-in-out transform shadow-md
          ${message.trim() && !isLoading
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-95'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
      >
        <Send size={18} className="transform transition-transform duration-200 ease-in-out" />
      </button>
    </form>
  );
};

export default MessageInput;
