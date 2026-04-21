'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatbotContext } from '@/app/providers/ChatbotProvider';
import { MessageCircle, Sparkles, Send, X } from 'lucide-react'

export const ChatbotWidget: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    settings,
    toggleChat,
    closeChat,
    sendMessage
  } = useChatbotContext();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Do not render if settings are not loaded
  if (!settings) return null;

  // Use only settings from database - no fallbacks
  const { primaryColor, secondaryColor, position, botName, iconUrl, placeholderText } = settings;

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-10 right-20',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const currentPosition = positionClasses[position];

  return (
   <div>
     <div className={`fixed ${currentPosition} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-4 w-[300px] rounded-32px overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"
          style={{
            background: `linear-gradient(135deg, ${secondaryColor}20 0%, ${secondaryColor}40 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${secondaryColor}40`,
            boxShadow: `0 8px 32px ${secondaryColor}30`,
            animation: 'fadeInZoomIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            }}
          >
            <div className="flex items-center gap-2">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={botName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{botName}</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="h-[280px] overflow-y-auto p-4 space-y-3 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: `${secondaryColor} transparent`
            }}
          >

            {messages.length === 0 ? (
              <div
                className="text-center p-4 rounded-xl"
                style={{ background: `${secondaryColor}20` }}
              >
                <p className="text-sm" style={{ color: secondaryColor }}>
                  Start a conversation with {botName}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl"
                    style={{
                      background:
                        message.role === 'user'
                          ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                          : 'white',
                      color: message.role === 'user' ? 'white' : '#333',
                      boxShadow: message.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span
                      className="text-xs opacity-70 mt-1 block"
                      style={{ color: message.role === 'user' ? 'rgba(255,255,255,0.7)' : '#666' }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl bg-white shadow-sm flex items-center gap-2"
                  style={{ borderRadius: '18px 18px 18px 4px' }}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: secondaryColor, animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: secondaryColor, animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: secondaryColor, animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                border: `1px solid ${secondaryColor}60`,
                background: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholderText}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim() && !isLoading
                    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                    : `${secondaryColor}40`
                }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      

      {/* Combined styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${secondaryColor};
          border-radius: 2px;
        }
        @keyframes fadeInZoomIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 4px 20px ${secondaryColor}50;
          }
          50% {
            box-shadow: 0 4px 30px ${secondaryColor}80;
          }
        }
      `}</style>
    </div>

    {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`absolute z-50 bottom-5 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          boxShadow: `0 4px 20px ${secondaryColor}50`,
          animation: isOpen ? '' : 'pulse 2s infinite'
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
       {isOpen ? (
  <X className="w-6 h-6 text-white" />
) : iconUrl ? (
  <img
    src={iconUrl}
    alt={botName}
    className="w-8 h-8 rounded-full object-cover"
  />
) : (
  <MessageCircle className="w-6 h-6 text-white" />
)}
      </button>
   </div>
  );
};
