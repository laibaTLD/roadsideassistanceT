'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ChatbotSettings {
  _id?: string;
  siteId: string;
  isEnabled: boolean;
  primaryColor: string;
  secondaryColor: string;
  iconUrl?: string;
  iconMediaId?: string;
  apiKey?: string;
  welcomeMessage: string;
  placeholderText: string;
  botName: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

interface UseChatbotReturn {
  settings: ChatbotSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useChatbot = (siteId: string): UseChatbotReturn => {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!siteId) {
      setSettings(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!API_BASE_URL) {
        setSettings(null);
        return;
      }

      const timestamp = Date.now();
      const response = await fetch(`${API_BASE_URL}/chatbot/public/${siteId}?t=${timestamp}`, {
        next: { revalidate: 300 },
      });

      // No chatbot configured or disabled on backend — treat as absent, not an error
      if (response.status === 404 || response.status === 204) {
        setSettings(null);
        return;
      }

      if (!response.ok) {
        setSettings(null);
        return;
      }

      const data = await response.json();
      const chatbotSettings = data?.data ?? data;

      if (!chatbotSettings || chatbotSettings.isEnabled === false) {
        setSettings(null);
        return;
      }

      setSettings(chatbotSettings);
    } catch {
      // Network or parse failure — hide chatbot without surfacing errors to the UI
      setSettings(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };
};
