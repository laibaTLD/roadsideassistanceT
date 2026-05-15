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
  const { settings, loading } = useChatbot(site?._id || '');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && settings) {
      console.log('[Chatbot Settings from Database]:', settings);
    }
  }, [settings]);

  const shouldShowChatbot = !loading && settings?.isEnabled === true;

  return (
    <ChatbotProvider settings={settings}>
      {children}
      {shouldShowChatbot && (
        <ChatbotWidget />
      )}
    </ChatbotProvider>
  );
};
