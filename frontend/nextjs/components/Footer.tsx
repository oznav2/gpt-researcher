import Image from 'next/image';
import Link from 'next/link';
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
    <footer className="border-t border-[#D2D2D2] bg-gradient-to-r from-[#151A2D] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Modal setChatBoxSettings={setChatBoxSettings} chatBoxSettings={chatBoxSettings} />
          <div className="text-center text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} השרת של אילן - עמית מחקר אוטונומי
          </div>
          <div className="flex items-center justify-center">
            <Link href="https://www.ilanel.co.il" target="_blank" className="transition-transform hover:scale-110">
              <Image src="/img/github.svg" alt="github" width={24} height={24} className="sm:w-[30px] sm:h-[30px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;