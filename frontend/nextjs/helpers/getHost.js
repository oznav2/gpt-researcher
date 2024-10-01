import getConfig from 'next/config';

const getFirstReachableUrl = async (urls) => {
  for (const url of urls) {
    try {
      const response = await fetch(`${url}/health`, { method: 'HEAD', timeout: 2000 });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.warn(`Failed to reach ${url}`, error);
    }
  }
  return null;
};
export const getHost = async ({purpose} = {}) => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost';
    return isLocalhost ? 'http://localhost:8000' : 'http://gpt.ilanel.co.il';
  } else if (purpose == 'langraph-gui') {
    return host.includes('localhost') ? 'http%3A%2F%2F1270.0.0.1%3A8123' : 'https://${host}';
  }
};

export const getSiteUrl = async () => {
  if (typeof window !== 'undefined') {
    const siteUrls = (process.env.NEXT_PUBLIC_SITE_URL || "http://wow.ilanel.co.il,http://localhost:3000").split(',');
    return window.location.host.includes('localhost')
      ? siteUrls[1]
      : (await getFirstReachableUrl(siteUrls) || siteUrls[0]);
  }
  return '';
};

export const getApiUrl = async () => {
  if (typeof window !== 'undefined') {
    const apiUrls = (process.env.NEXT_PUBLIC_API_URL || "http://gpt.ilanel.co.il,http://localhost:8000").split(',');
    return window.location.host.includes('localhost')
      ? apiUrls[1]
      : (await getFirstReachableUrl(apiUrls) || apiUrls[0]);
  }
  return '';
};