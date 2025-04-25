
import React, { useEffect, useState } from 'react';
import { Message } from './ChatInterface';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string>('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  useEffect(() => {
    // Reset typing animation when no messages
    if (messages.length === 0) {
      setDisplayMessages([]);
      setIsTyping(false);
      setCurrentTypingMessage('');
      setTypingMessageId(null);
      return;
    }

    // Check if there's a new message to display with typing animation
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.sender === 'ai' && lastMessage.id !== typingMessageId) {
      // Remember this message is being animated
      setTypingMessageId(lastMessage.id);
      setIsTyping(true);
      
      // Display all previous messages immediately
      setDisplayMessages(messages.slice(0, -1));
      
      let currentText = '';
      const words = lastMessage.text.split(' ');
      let wordIndex = 0;

      const typingInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          setCurrentTypingMessage(currentText);
          wordIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setDisplayMessages(messages);
        }
      }, 50); // Adjust speed as needed

      return () => clearInterval(typingInterval);
    } else if (lastMessage.sender === 'user' || !isTyping) {
      // Immediately display user messages or when not typing
      setDisplayMessages(messages);
    }
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-full">
      {/* Display all messages except the last AI one if it's currently being typed */}
      {displayMessages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {/* Display the AI message currently being typed */}
      {isTyping && (
        <MessageBubble 
          message={{
            id: typingMessageId || 'typing',
            text: currentTypingMessage,
            sender: 'ai',
            timestamp: new Date()
          }} 
        />
      )}

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
