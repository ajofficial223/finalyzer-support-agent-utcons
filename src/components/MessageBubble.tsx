import React from 'react';
import { Message } from './ChatInterface';
import FormattedMessage from './FormattedMessage';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

const MessageBubble = ({ message, isTyping = false }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`px-5 py-3 shadow-lg max-w-[80%] ${
          isUser
            ? 'glass-effect bg-primary/20 text-foreground rounded-2xl rounded-br-sm'
            : 'glass-effect bg-background/60 text-foreground rounded-2xl rounded-bl-sm'
        }`}
      >
        {isUser ? (
          message.text
        ) : (
          <FormattedMessage text={message.text} isTyping={isTyping} />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
