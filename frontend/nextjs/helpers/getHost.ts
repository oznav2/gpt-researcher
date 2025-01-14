interface GetHostParams {
  purpose?: string;
}

const getFirstReachableUrl = async (urls: string[]): Promise<string | null> => {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${url}/health`, {
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.warn(`Failed to reach ${url}`, error);
    }
  }
  return null;
};

export const getHost = ({ purpose }: GetHostParams = {}): string => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost';
    return isLocalhost ? 'http://localhost:8000' : 'https://gpt.ilanel.co.il';
  } else if (purpose === 'langgraph-gui') {
    const host = process.env.LANGGRAPH_HOST_URL || 'https://langgraph.ilanel.co.il';
    return host.includes('localhost') ? 'http://127.0.0.1:8123' : `https://${host}`;
  }
  // Default fallback
  return 'https://gpt.ilanel.co.il';
};

export const getSiteUrl = async () => {
  if (typeof window !== 'undefined') {
    const siteUrls = (process.env.NEXT_PUBLIC_SITE_URL || "https://wow.ilanel.co.il,http://localhost:3000").split(',');
    return window.location.host.includes('localhost')
      ? siteUrls[1]
      : (await getFirstReachableUrl(siteUrls) || siteUrls[0]);
  }
  return '';
};

export const getApiUrl = async () => {
  if (typeof window !== 'undefined') {
    const apiUrls = (process.env.NEXT_PUBLIC_API_URL || "https://gpt.ilanel.co.il,http://localhost:8000").split(',');
    return window.location.host.includes('localhost')
      ? apiUrls[1]
      : (await getFirstReachableUrl(apiUrls) || apiUrls[0]);
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://gpt.ilanel.co.il';
};

export const getOpenAIApiKey = () => {
  return process.env.OPENAI_API_KEY || '';
};