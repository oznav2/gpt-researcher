import Image from "next/image";

interface HeaderProps {
  loading?: boolean;      // Indicates if research is currently in progress
  isStopped?: boolean;    // Indicates if research was manually stopped
  showResult?: boolean;   // Controls if research results are being displayed
  onStop?: () => void;    // Handler for stopping ongoing research
  onNewResearch?: () => void;  // Handler for starting fresh research
}

const Header = ({ loading, isStopped, showResult, onStop, onNewResearch }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient background without blur effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>
      
      {/* Header container with proper spacing */}
      <div className="container relative mx-auto px-4 py-4">
        <div className="flex flex-col items-center">
          {/* Logo with proper spacing */}
          <a href="/" className="relative z-10 mb-2">
            <Image
              src="/img/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
              priority
            />
          </a>
          
          {/* Action buttons container */}
          <div className="flex gap-2 transition-all duration-300 ease-in-out">
            {loading && !isStopped && (
              <button
                onClick={onStop}
                className="flex items-center justify-center px-4 sm:px-6 h-8 text-xs sm:text-sm text-white 
                bg-red-500 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all 
                duration-200 shadow-lg whitespace-nowrap"
              >
                עצור
              </button>
            )}
            {(isStopped || !loading) && showResult && (
              <button
                onClick={onNewResearch}
                className="flex items-center justify-center px-4 sm:px-6 h-8 text-xs sm:text-sm text-white 
                bg-[rgb(168,85,247)] rounded-full hover:bg-[rgb(147,51,234)] transform hover:scale-105 
                transition-all duration-200 shadow-lg whitespace-nowrap"
              >
                מחקר חדש
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
