
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending to webhook:', text);
      const response = await fetch('https://avishkarofficial.app.n8n.cloud/webhook/8d956423-35a9-4b99-8205-63af1b4e721a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      console.log('Webhook response:', await response.text());

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.reply || "I apologize, but I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, but I couldn't connect to the server. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA]">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-center">💬 Finalyzer – Your Smart AI Support Agent</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-4">
          <MessageInput onSend={sendMessage} isLoading={isLoading} />
        </div>
        <div className="text-center text-sm text-gray-500 py-2 border-t">
          <a href="https://lovable.ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#4A90E2] transition-colors">
            Created with ❤️ using Lovable
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;

