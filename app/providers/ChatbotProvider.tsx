'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LangGraphChatbot, ChatMessage as LangChatMessage } from '@/app/lib/langgraph-chatbot';
import { ChatbotSettings } from '@/app/hooks/useChatbot';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  settings: ChatbotSettings | null;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  setSettings: (settings: ChatbotSettings | null) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
  settings?: ChatbotSettings | null;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children, settings: initialSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatbotSettings | null>(initialSettings || null);
  const [chatbot, setChatbot] = useState<LangGraphChatbot | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Update settings when prop changes
  useEffect(() => {
    if (initialSettings !== undefined) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  // Initialize LangGraph chatbot when settings with API key are available
  useEffect(() => {
    if (settings?.apiKey) {
      try {
        const newChatbot = new LangGraphChatbot({
          apiKey: settings.apiKey,
          model: 'gemini-2.5-flash',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: `You are ${settings.botName || 'a helpful AI assistant'}. 
Your role is to assist users with their inquiries in a friendly and professional manner.
Keep your responses concise and helpful.`
        });
        setChatbot(newChatbot);
      } catch (error) {
        console.error('Failed to initialize chatbot:', error);
      }
    } else {
      setChatbot(null);
    }
  }, [settings]);

  // Show welcome message when chat is opened and no messages exist
  useEffect(() => {
    if (isOpen && settings?.welcomeMessage && !hasShownWelcome && messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: settings.welcomeMessage,
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
      setHasShownWelcome(true);
    }
  }, [isOpen, settings, messages.length, hasShownWelcome]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setHasShownWelcome(false);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading || !chatbot) {
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert messages to LangGraph format
      const conversationHistory: LangChatMessage[] = messages
        .filter(msg => msg.role !== 'assistant' || msg.id.startsWith('welcome-'))
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Get response from chatbot
      const response = await chatbot.chat(message, conversationHistory);

      if (response.error) {
        // Check if it's a quota exceeded error
        const isQuotaError = response.error.includes('quota') ||
                            response.error.includes('429') ||
                            response.error.includes('RESOURCE_EXHAUSTED');

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: isQuotaError
            ? 'Sorry, the AI service has reached its usage limit. Please try again in a few minutes or contact support.'
            : response.error,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else if (response.response) {
        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Check if it's a quota exceeded error
      const isQuotaError = error instanceof Error &&
                          (error.message.includes('quota') ||
                           error.message.includes('429') ||
                           error.message.includes('RESOURCE_EXHAUSTED'));

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: isQuotaError
          ? 'Sorry, the AI service has reached its usage limit. Please try again in a few minutes or contact support.'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chatbot, isLoading, messages]);

  const contextValue: ChatbotContextType = {
    isOpen,
    messages,
    isLoading,
    settings,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    clearMessages,
    setSettings
  };

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
    </ChatbotContext.Provider>
  );
};
