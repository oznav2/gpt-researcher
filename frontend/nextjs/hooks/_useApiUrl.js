import { useState, useEffect } from 'react';

export function useApiUrl() {
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const determineApiUrl = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost') {
          return 'http://localhost:8000';
        } else if (hostname === 'wow.ilanel.co.il') {
          return 'https://gpt.ilanel.co.il';
        }
      }
      
      if (purpose === 'langraph-gui') {
        const host = process.env.LANGGRAPH_HOST_URL || 'https://langgraph.ilanel.co.il';
        return host.includes('localhost') ? 'http://127.0.0.1:8123' : `https://${host}`;
      }
      
      return process.env.NEXT_PUBLIC_API_URL || 'https://gpt.ilanel.co.il';
    };

    setApiUrl(determineApiUrl());
  }, []);

  return apiUrl;
}
