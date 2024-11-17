import Image from "next/image";
import Link from "next/link";
import Modal from './Settings/Modal';

interface ChatBoxSettings {
  report_source: string;
  report_type: string;
  tone: string;
}

interface ChatBoxProps {
  chatBoxSettings: ChatBoxSettings;
  setChatBoxSettings: React.Dispatch<React.SetStateAction<ChatBoxSettings>>;
}

const Footer = ({ setChatBoxSettings, chatBoxSettings }: ChatBoxProps) => {

  return (
    <footer className="bg-gradient-to-r from-[#151A2D] to-[#111827] text-white">
      <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Modal setChatBoxSettings={setChatBoxSettings} chatBoxSettings={chatBoxSettings} />
          <div className="text-center text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} השרת של אילן - עמית מחקר אוטונומי
          </div>
          <div className="flex items-center justify-center">
            <Link href="https://www.ilanel.co.il" target="_blank" className="transition-transform hover:scale-110">
              <Image src="/img/splash-dark.svg" alt="github" width={24} height={24} className="sm:w-[30px] sm:h-[30px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
