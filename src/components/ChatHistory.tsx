
import React from 'react';
import { format } from 'date-fns';
import { Message } from './ChatInterface';

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ sessions, onSelectSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No chat history found
      </div>
    );
  }

  // Sort sessions by most recent first
  const sortedSessions = [...sessions].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
      {sortedSessions.map(session => {
        // Get first user message if exists, otherwise use first AI message
        const firstUserMessage = session.messages.find(m => m.sender === 'user');
        const displayMessage = firstUserMessage || session.messages[0];
        const truncatedText = displayMessage.text.length > 50
          ? `${displayMessage.text.substring(0, 50)}...`
          : displayMessage.text;

        return (
          <button
            key={session.id}
            className="w-full text-left p-3 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
            onClick={() => onSelectSession(session.id)}
          >
            <div className="font-medium text-sm">{truncatedText}</div>
            <div className="text-xs text-gray-500 mt-1">
              {format(new Date(session.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
              <span className="ml-2 bg-gray-100 px-1.5 rounded-full text-xs">
                {session.messages.length} messages
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatHistory;
