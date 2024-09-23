import Image from 'next/image';

const SourceCard = ({ source }: { source: { name: string; url: string } }) => {
  return (
    <div className="flex h-auto sm:h-[79px] w-full sm:w-auto items-center gap-2.5 rounded border border-solid border-[#C1C1C1] dark:border-gray-700 bg-neutral-50 dark:bg-gray-800 px-1.5 py-2 sm:py-1">
      <div className="flex-shrink-0">
        <Image
          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
          alt={source.url}
          className="p-1 w-8 h-8 sm:w-11 sm:h-11"
          width={44}
          height={44}
        />
      </div>
      <div className="flex flex-col justify-center gap-1 sm:gap-[7px] overflow-hidden">
        <h6 className="line-clamp-2 text-xs sm:text-sm font-light leading-tight sm:leading-[normal] text-[#1B1B16] dark:text-gray-200">
          {source.name}
        </h6>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={source.url}
          className="truncate text-xs sm:text-sm font-light text-[#1B1B16]/30 dark:text-gray-400 hover:text-[#1B1B16]/50 dark:hover:text-gray-300 transition-colors"
        >
          {source.url}
        </a>
      </div>
    </div>
  );
};

export default SourceCard;
