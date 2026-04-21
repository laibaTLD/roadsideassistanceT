import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph, END } from '@langchain/langgraph';
import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';

export interface ChatbotConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});

export class LangGraphChatbot {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private systemPrompt: string;
  private llm: ChatGoogleGenerativeAI | null = null;
  private graph: any;

  constructor(config: ChatbotConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.0-flash-exp';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1000;
    this.systemPrompt = config.systemPrompt || 'You are a helpful AI assistant.';

    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    this.initializeLLM();
    this.buildGraph();
  }

  private initializeLLM(): void {
    try {
      this.llm = new ChatGoogleGenerativeAI({
        apiKey: this.apiKey,
        model: this.model,
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
      });
    } catch (error) {
      console.error('Failed to initialize LLM:', error);
      throw new Error('Failed to initialize AI model');
    }
  }

  private buildGraph(): void {
    try {
      const chatbotNode = async (state: typeof StateAnnotation.State) => {
        const messages = state.messages;
        
        if (!this.llm) {
          throw new Error('LLM not initialized');
        }

        const response = await this.llm.invoke(messages);
        return { messages: [response] };
      };

      const errorHandlerNode = async (state: typeof StateAnnotation.State) => {
        const errorMessage = this.handleError(new Error('Chat processing failed'));
        return { messages: [new AIMessage(errorMessage)] };
      };

      const shouldContinue = (state: typeof StateAnnotation.State) => {
        const messages = state.messages;
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && 'content' in lastMessage) {
          return 'chatbot';
        }
        return 'errorHandler';
      };

      const workflow = new StateGraph(StateAnnotation)
        .addNode('chatbot', chatbotNode)
        .addNode('errorHandler', errorHandlerNode)
        .addEdge('__start__', 'chatbot')
        .addConditionalEdges(
          'chatbot',
          shouldContinue,
          {
            chatbot: END,
            errorHandler: 'errorHandler',
          }
        )
        .addEdge('errorHandler', END);

      this.graph = workflow.compile();
    } catch (error) {
      console.error('Failed to build graph:', error);
      throw new Error('Failed to build conversation graph');
    }
  }

  private handleError(error: unknown): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('api key') || message.includes('authentication')) {
        return 'I apologize, but there\'s an issue with the AI service configuration. Please contact support.';
      }
      
      if (message.includes('rate limit') || message.includes('quota')) {
        return 'I\'m receiving too many requests right now. Please try again in a moment.';
      }
      
      if (message.includes('network') || message.includes('fetch')) {
        return 'I\'m having trouble connecting to the AI service. Please check your internet connection.';
      }
      
      return 'I encountered an error while processing your message. Please try again.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  private validateMessage(message: string): boolean {
    if (!message || message.trim().length === 0) {
      return false;
    }
    
    if (message.length > 10000) {
      return false;
    }
    
    return true;
  }

  private convertToLangChainMessages(history: ChatMessage[]): BaseMessage[] {
    const messages: BaseMessage[] = [];
    
    // Add system prompt first
    messages.push(new SystemMessage(this.systemPrompt));
    
    // Add conversation history
    for (const msg of history) {
      if (msg.role === 'user') {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        messages.push(new AIMessage(msg.content));
      }
    }
    
    return messages;
  }

  async chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      // Validate message
      if (!this.validateMessage(userMessage)) {
        return {
          response: '',
          error: 'Message must be between 1 and 10,000 characters.'
        };
      }

      // Add user message to history
      const updatedHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      // Convert to LangChain messages
      const messages = this.convertToLangChainMessages(updatedHistory);

      // Invoke the graph
      const result = await this.graph.invoke({ messages });
      
      // Extract the AI response
      const lastMessage = result.messages[result.messages.length - 1];
      const responseContent = typeof lastMessage.content === 'string' 
        ? lastMessage.content 
        : String(lastMessage.content);

      return {
        response: responseContent
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        response: '',
        error: this.handleError(error)
      };
    }
  }

  async *chatStream(userMessage: string, conversationHistory: ChatMessage[] = []): AsyncGenerator<string, void, unknown> {
    try {
      // Validate message
      if (!this.validateMessage(userMessage)) {
        yield 'Error: Message must be between 1 and 10,000 characters.';
        return;
      }

      // Add user message to history
      const updatedHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      // Convert to LangChain messages
      const messages = this.convertToLangChainMessages(updatedHistory);

      // Stream the response
      if (!this.llm) {
        throw new Error('LLM not initialized');
      }

      const stream = await this.llm.stream(messages);
      
      for await (const chunk of stream) {
        const content = typeof chunk.content === 'string' 
          ? chunk.content 
          : String(chunk.content);
        yield content;
      }
    } catch (error) {
      console.error('Chat stream error:', error);
      yield this.handleError(error);
    }
  }
}
