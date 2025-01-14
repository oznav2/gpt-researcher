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

const Footer = ({ setChatBoxSettings, chatBoxSettings}: ChatBoxProps) => {
  
  return (
    <>
      <div className="container flex min-h-[72px] mt-2 items-center justify-between border-t border-[#D2D2D2] px-4 pb-3 pt-5 lg:min-h-[72px] lg:px-0 lg:py-5">
        <Modal setChatBoxSettings={setChatBoxSettings} chatBoxSettings={chatBoxSettings} />
        <div className="text-sm text-gray-100 mr-2">
            © {new Date().getFullYear()} עמית מחקר מבוסס בינה מלאכותית.
        </div>
        <div className="flex items-center gap-3">
          <Link href={"https://www.ilanel.co.il"} target="_blank">
            <Image
              src={"/img/github.svg"}
              alt="github"
              width={30}
              height={30}
            />{" "}
          </Link>
          <Link href={"https://wa.me/972506700950"} target="_blank">
              <Image
                src={"/img/discord.svg"}
                alt="discord"
                width={30}
                height={30}
              />{" "}
          </Link>
          
        </div>
      </div>
    </>
  );
};

export default Footer;