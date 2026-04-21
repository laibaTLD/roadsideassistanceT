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
      setError('Site ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!API_BASE_URL) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is required');
      }
      const timestamp = Date.now();
      const response = await fetch(`${API_BASE_URL}/chatbot/public/${siteId}?t=${timestamp}`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chatbot settings: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error('Invalid response format from chatbot API');
      }

      setSettings(data.data);
    } catch (err) {
      console.error('Error fetching chatbot settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chatbot settings');
      setSettings(null);
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
