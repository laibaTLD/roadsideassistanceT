'use client';

import React, { useEffect, ReactNode } from 'react';
import { ChatbotProvider } from './ChatbotProvider';
import { useChatbot } from '@/app/hooks/useChatbot';
import { useWebBuilder } from './WebBuilderProvider';
import { ChatbotWidget } from '@/app/components/chatbot/ChatbotWidget';

interface ChatbotProviderWrapperProps {
  children: ReactNode;
}

export const ChatbotProviderWrapper: React.FC<ChatbotProviderWrapperProps> = ({ children }) => {
  const { site } = useWebBuilder();
  const { settings, loading, error } = useChatbot(site?._id || '');

  // Development mode: show chatbot even if API fails
  const isDev = process.env.NODE_ENV === 'development';

  // Log chatbot settings from database
  useEffect(() => {
    if (settings) {
      console.log('[Chatbot Settings from Database]:', settings);
    }
  }, [settings]);

  // Only render chatbot if enabled and settings are loaded
  // In development, show it even if API fails for testing
  const shouldShowChatbot = isDev 
    ? !loading 
    : !loading && settings?.isEnabled === true;

  return (
    <ChatbotProvider settings={settings}>
      {children}
      {shouldShowChatbot && (
        <ChatbotWidget />
      )}
    </ChatbotProvider>
  );
};
