import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, History, LogOut } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestedQuestions from './SuggestedQuestions';
import { useDrawer } from '@/hooks/useDrawer';
import ChatHistory from './ChatHistory';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { ModeToggle } from './ModeToggle';
import { useNavigate } from 'react-router-dom';

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

interface UserProfile {
  name: string;
  email: string;
  industry: string;
  organization: string;
}

// Create a function to generate welcome message
const createWelcomeMessage = (name?: string): Message => {
  const welcomeText = name
    ? `👋 Hi, ${name}! I'm FinAlyzer AI — I help you with financial consolidation, analytics, statutory reporting, and more.\nAsk me anything, or try one of the suggested questions below!`
    : '👋 Hi! I\'m FinAlyzer AI — I help you with financial consolidation, analytics, statutory reporting, and more.\nAsk me anything, or try one of the suggested questions below!';
  
  return {
    id: 'welcome-' + Date.now(),
    text: welcomeText,
    sender: 'ai' as const,
    timestamp: new Date(),
  };
};

// Webhook URLs
const CHAT_WEBHOOK_URL = 'https://testingperpose05.app.n8n.cloud/webhook/8d956423-35a9-4b99-8205-63af1b4e721a';

const ChatInterface = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Initialize with an empty array, we'll set the welcome message after loading the profile
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
        
        // Create personalized welcome message with user's name
        const welcomeMessage = createWelcomeMessage(parsedProfile.name);
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error parsing user profile:', error);
        // If there's an error, still show the default welcome message
        setMessages([createWelcomeMessage()]);
      }
    } else {
      // If no profile, show default welcome message
      setMessages([createWelcomeMessage()]);
    }
    
    // Check if there's an existing session to load
    const currentSessionId = localStorage.getItem('currentSessionId');
    if (currentSessionId) {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          const session = parsedHistory.find((s: any) => s.id === currentSessionId);
          if (session && session.messages && session.messages.length > 0) {
            const formattedMessages = session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error('Error loading existing session:', error);
        }
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

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
    if (messages.length > 0) {
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
      const payload = {
        message: text,
        userProfile // Include user profile in the request
      };
      
      console.log('Sending to webhook:', payload);
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
    // Create personalized welcome message if user profile exists
    const welcomeMessage = createWelcomeMessage(userProfile?.name);
    setMessages([welcomeMessage]);
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
  
  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('currentSessionId');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="glass-effect px-4 sm:px-6 py-3 sm:py-4 flex items-center sticky top-0 z-10">
        <div className="flex-1 flex items-center">
          <img 
            src="/lovable-uploads/5feb2d40-47dc-440e-b075-22b9d60d713b.png"
            alt="FinAlyzer Logo" 
            className="h-8 sm:h-10 mr-3 sm:mr-4"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">FinAlyzer Support AI</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {userProfile ? `${userProfile.name} - ${userProfile.organization}` : 'Your smart assistant for financial reporting and analytics.'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={resetChat} 
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-sm glass-effect hover:shadow-md active:scale-95 rounded-md 
              transition-all duration-200 ease-in-out"
            title="Reset Chat"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)} 
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-sm glass-effect hover:shadow-md active:scale-95 rounded-md 
              transition-all duration-200 ease-in-out"
            title="View Chat History"
          >
            <History size={16} />
            <span className="hidden sm:inline">History</span>
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-sm glass-effect hover:shadow-md active:scale-95 rounded-md 
              transition-all duration-200 ease-in-out"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          <MessageList messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="glass-effect border-t mt-auto sticky bottom-0 z-10">
        <div className="container mx-auto px-2 py-2">
          <SuggestedQuestions onSendQuestion={sendMessage} />
        </div>
        <div className="container mx-auto py-4">
          <MessageInput onSend={sendMessage} isLoading={isLoading} />
        </div>
        <div className="text-center text-sm text-muted-foreground py-2 border-t">
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
