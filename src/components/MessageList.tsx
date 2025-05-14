import React, { useEffect, useState, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Initial scroll and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, isLoading]);

  // Continuous scroll during typing
  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [currentTypingMessage, isTyping]);

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

      // Force scroll to latest position when animation starts
      setTimeout(() => scrollToBottom(false), 50);

      const typingInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          setCurrentTypingMessage(currentText);
          wordIndex++;
          // This will trigger the useEffect above to scroll as text is added
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setDisplayMessages(messages);
          setTimeout(() => scrollToBottom(), 100);
        }
      }, 50); // Speed of typing animation

      return () => clearInterval(typingInterval);
    } else if (lastMessage.sender === 'user' || !isTyping) {
      // Immediately display user messages or when not typing
      setDisplayMessages(messages);
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col space-y-4 p-4 overflow-y-auto h-full scroll-smooth"
    >
      {displayMessages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isTyping && (
        <MessageBubble 
          message={{
            id: typingMessageId || 'typing',
            text: currentTypingMessage,
            sender: 'ai',
            timestamp: new Date()
          }}
          isTyping={true}
        />
      )}

      {isLoading && (
        <div className="flex items-center space-x-2 animate-pulse self-start glass-effect bg-background/60 rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg max-w-[80%]">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
