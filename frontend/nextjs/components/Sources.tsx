import Image from 'next/image';
import SourceCard from "./SourceCard";

export default function Sources({
  sources,
}: {
  sources: { name: string; url: string }[];
}) {
  return (
    <div className="container h-auto w-full shrink-0 rounded-lg border border-solid border-[#C2C2C2] dark:border-gray-700 bg-gray-800 dark:bg-gray-900 shadow-md p-3 sm:p-5">
      <div className="flex items-start gap-2 sm:gap-4 pb-3 lg:pb-3.5">
        <Image
          src="/img/sources.svg"
          alt="footer"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 dark:filter dark:invert"
        />
        <h3 className="text-sm sm:text-base font-bold uppercase leading-[152.5%] text-white dark:text-gray-200">
          מקורות הכי רלוונטים:{" "}
        </h3>
      </div>
      <div className="flex w-full max-w-[890px] flex-wrap content-center items-center gap-2 sm:gap-[15px]">
        {sources.length > 0 ? (
          sources.map((source) => (
            <SourceCard source={source} key={source.url} />
          ))
        ) : (
          <>
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-16 sm:h-20 w-full sm:w-[260px] max-w-sm animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
          </>
        )}
      </div>
    </div>
  );
}
