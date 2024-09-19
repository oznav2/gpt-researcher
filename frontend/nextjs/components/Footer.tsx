import Image from 'next/image';
import Link from 'next/link';
//import Modal from './Settings/Modal';
import Modal from '@/components/Settings/Modal';
import { FC } from 'react';

// Define the ChatBoxSettings interface
interface ChatBoxSettings {
  ANTHROPIC_API_KEY: string;
  TAVILY_API_KEY: string;
  LANGCHAIN_TRACING_V2: string;
  LANGCHAIN_API_KEY: string;
  OPENAI_API_KEY: string;
  DOC_PATH: string;
  RETRIEVER: 'tavily' | 'google' | 'searx' | 'serpapi' | 'googleSerp' | 'duckduckgo' | 'bing';
  GOOGLE_API_KEY: string;
  GOOGLE_CX_KEY: string;
  BING_API_KEY: string;
  SERPAPI_API_KEY: string;
  SERPER_API_KEY: string;
  SEARX_URL: string;
  LANGGRAPH_HOST_URL: string;
}

// Define the props for the Footer component
interface FooterProps {
  setChatBoxSettings: (settings: ChatBoxSettings) => void;
  chatBoxSettings: ChatBoxSettings;
}

const Footer: FC<FooterProps> = ({ setChatBoxSettings, chatBoxSettings }) => {
  return (
    <div className="container flex min-h-[72px] items-center justify-between border-t border-[#D2D2D2] px-4 pb-3 pt-5 lg:min-h-[72px] lg:px-0 lg:py-5">
      <Modal setChatBoxSettings={setChatBoxSettings} chatBoxSettings={chatBoxSettings} />
      <div className="text-sm text-gray-500">
        © {new Date().getFullYear()}השרת של אילן - עמית מחקר אוטונומי
      </div>
      <div className="flex items-center gap-3">
        <Link href="https://www.ilanel.co.il" target="_blank">
          <Image src="/img/github.svg" alt="github" width={30} height={30} />
        </Link>
      </div>
    </div>
  );
};

export default Footer;