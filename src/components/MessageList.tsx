
import React from 'react';
import { Message } from './ChatInterface';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-full">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 animate-pulse self-start bg-white rounded-lg px-4 py-2 shadow-sm max-w-[80%]">
          <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
