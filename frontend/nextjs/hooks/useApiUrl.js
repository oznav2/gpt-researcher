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
          return 'https://gpt.ilanel.co.il';  // Note the https here
        }
      }
      // Fallback to environment variable or default
      return process.env.NEXT_PUBLIC_API_URL || 'https://gpt.ilanel.co.il';
    };

    setApiUrl(determineApiUrl());
  }, []);

  return apiUrl;
}