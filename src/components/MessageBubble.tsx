
import React from 'react';
import { Message } from './ChatInterface';
import FormattedMessage from './FormattedMessage';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`px-4 py-2 rounded-lg shadow-sm max-w-[80%] ${
          isUser
            ? 'bg-[#4A90E2] text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        {isUser ? (
          message.text
        ) : (
          <FormattedMessage text={message.text} />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
