import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, History } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestedQuestions from './SuggestedQuestions';
import { useDrawer } from '@/hooks/useDrawer';
import ChatHistory from './ChatHistory';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  text: '👋 Hi! I\'m Finalyzer AI — I help you with financial consolidation, analytics, statutory reporting, and more.\nAsk me anything, or try one of the suggested questions below!',
  sender: 'ai' as const,
  timestamp: new Date(),
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const formattedHistory = parsedHistory.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistory(formattedHistory);
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      const currentSessionId = localStorage.getItem('currentSessionId') || Date.now().toString();
      localStorage.setItem('currentSessionId', currentSessionId);
      
      const updatedHistory = [...chatHistory];
      const sessionIndex = updatedHistory.findIndex(s => s.id === currentSessionId);
      
      if (sessionIndex >= 0) {
        updatedHistory[sessionIndex] = {
          ...updatedHistory[sessionIndex],
          messages
        };
      } else {
        updatedHistory.push({
          id: currentSessionId,
          messages,
          createdAt: new Date()
        });
      }
      
      setChatHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
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

      const responseText = await response.text();
      console.log('Webhook response:', responseText);
      
      let aiReply = "I apologize, but I couldn't process your request.";
      
      if (responseText && responseText.trim()) {
        try {
          const data = JSON.parse(responseText);
          if (data.reply) {
            aiReply = data.reply;
          } else if (data.output) {
            aiReply = data.output;
          }
        } catch (parseError) {
          console.error('Error parsing webhook response:', parseError);
        }
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiReply,
        sender: 'ai' as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, but I couldn't connect to the server. Please try again.",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('currentSessionId');
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      localStorage.setItem('currentSessionId', sessionId);
      setIsHistoryOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] w-full">
      <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex items-center">
        <div className="flex-1 flex items-center">
          <img 
            src="/lovable-uploads/5feb2d40-47dc-440e-b075-22b9d60d713b.png"
            alt="Finalyzer Logo" 
            className="h-8 sm:h-10 mr-3 sm:mr-4"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Finalyzer Support AI</h1>
            <p className="text-xs sm:text-sm text-gray-500">Your smart assistant for financial reporting and analytics.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={resetChat} 
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-sm bg-gray-100 
              hover:bg-gray-200 hover:shadow-md active:scale-95 rounded-md 
              transition-all duration-200 ease-in-out"
            title="Reset Chat"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)} 
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-sm bg-gray-100 
              hover:bg-gray-200 hover:shadow-md active:scale-95 rounded-md 
              transition-all duration-200 ease-in-out"
            title="View Chat History"
          >
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-2 py-2">
          <SuggestedQuestions onSendQuestion={sendMessage} />
        </div>
        <div className="container mx-auto py-4">
          <MessageInput onSend={sendMessage} isLoading={isLoading} />
        </div>
        <div className="text-center text-sm text-gray-500 py-2 border-t">
          Testing Agent Created by UTCONS
        </div>
      </footer>
      
      <Drawer open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Chat History</DrawerTitle>
          </DrawerHeader>
          <ChatHistory sessions={chatHistory} onSelectSession={loadChatSession} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatInterface;
