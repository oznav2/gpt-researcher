import { useRef, useState } from 'react';
import { Data, ChatBoxSettings, QuestionData } from '../types/data';

export const useWebSocket = (setOrderedData: React.Dispatch<React.SetStateAction<Data[]>>, setAnswer: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setShowHumanFeedback: React.Dispatch<React.SetStateAction<boolean>>, setQuestionForHuman: React.Dispatch<React.SetStateAction<boolean | true>>) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const heartbeatInterval = useRef<number>();
  const reconnectAttempts = useRef<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const SOCKET_TIMEOUT = 300000; // 5 minutes

  const determineWebSocketUrl = (purpose?: string) => {
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
      
      if (hostname === 'localhost') {
        return `${wsProtocol}//localhost:8000/ws`;
      } else if (hostname === 'wow.ilanel.co.il') {
        return `wss://gpt.ilanel.co.il/ws`;
      }
    }
    
    if (purpose === 'langraph-gui') {
      const host = process.env.LANGGRAPH_HOST_URL || 'https://langgraph.ilanel.co.il';
      const wsHost = host.includes('localhost') ? '127.0.0.1:8123' : host.replace(/^https?:\/\//, '');
      return `${typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${wsHost}/ws`;
    }
    
    if (typeof window !== 'undefined') {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${wsProtocol}//${process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'gpt.ilanel.co.il'}/ws`;
    }
    
    return null;
  };

  const initializeWebSocket = (promptValue: string, chatBoxSettings: ChatBoxSettings) => {
    const storedConfig = localStorage.getItem('apiVariables');
    const apiVariables = storedConfig ? JSON.parse(storedConfig) : {};
    const headers = {
      'retriever': apiVariables.RETRIEVER,
      'langchain_api_key': apiVariables.LANGCHAIN_API_KEY,
      'openai_api_key': apiVariables.OPENAI_API_KEY,
      'tavily_api_key': apiVariables.TAVILY_API_KEY,
      'google_api_key': apiVariables.GOOGLE_API_KEY,
      'google_cx_key': apiVariables.GOOGLE_CX_KEY,
      'bing_api_key': apiVariables.BING_API_KEY,
      'searchapi_api_key': apiVariables.SEARCHAPI_API_KEY,
      'serpapi_api_key': apiVariables.SERPAPI_API_KEY,
      'serper_api_key': apiVariables.SERPER_API_KEY,
      'searx_url': apiVariables.SEARX_URL
    };

    if (!socket && typeof window !== 'undefined') {
      const ws_uri = determineWebSocketUrl();
      if (!ws_uri) return;

      const newSocket = new WebSocket(ws_uri);
      
      // Set a longer timeout
      newSocket.onopen = () => {
        reconnectAttempts.current = 0;
        const { report_type, report_source, tone } = chatBoxSettings;
        let data = "start " + JSON.stringify({ task: promptValue, report_type, report_source, tone, headers });
        newSocket.send(data);

        // Send ping every 30 seconds to keep connection alive
        heartbeatInterval.current = window.setInterval(() => {
          if (newSocket.readyState === WebSocket.OPEN) {
            newSocket.send('ping');
          }
        }, 30000);

        // Set a timeout to close the connection if inactive
        setTimeout(() => {
          if (newSocket.readyState === WebSocket.OPEN) {
            newSocket.close();
            setSocket(null);
          }
        }, SOCKET_TIMEOUT);
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'human_feedback' && data.content === 'request') {
            setQuestionForHuman(data.output);
            setShowHumanFeedback(true);
          } else {
            const contentAndType = `${data.content}-${data.type}`;
            setOrderedData((prevOrder) => [...prevOrder, { ...data, contentAndType }]);

            if (data.type === 'report') {
              setAnswer((prev: any) => prev + data.output);
            } else if (data.type === 'path' || data.type === 'chat') {
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      newSocket.onclose = () => {
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        setSocket(null);
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++;
          setTimeout(() => initializeWebSocket(promptValue, chatBoxSettings), 1000 * reconnectAttempts.current);
        }
      };

      setSocket(newSocket);
    } else if (socket) {
      const { report_type, report_source, tone } = chatBoxSettings;
      let data = "start " + JSON.stringify({ task: promptValue, report_type, report_source, tone, headers });
      socket.send(data);
    }
  };

  return { socket, setSocket, initializeWebSocket };
};