import Image from 'next/image';

const SimilarTopics = ({
  similarQuestions,
  handleDisplayResult,
  reset,
}: {
  similarQuestions: string[];
  handleDisplayResult: (item: string) => void;
  reset: () => void;
}) => {
  return (
    <div className="container flex flex-col sm:flex-row h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#C2C2C2] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 lg:p-10">
      <div className="hidden lg:block">
        <Image
          src="/img/similarTopics.svg"
          alt="footer"
          width={24}
          height={24}
          className="dark:filter dark:invert"
        />
      </div>
      <div className="flex-1 divide-y divide-[#E5E5E5] dark:divide-gray-700">
        <div className="flex gap-4 pb-3">
          <Image
            src="/img/similarTopics.svg"
            alt="footer"
            width={24}
            height={24}
            className="block lg:hidden dark:filter dark:invert"
          />
          <h3 className="text-base font-bold uppercase text-black dark:text-white">
            נושאים דומים:{" "}
          </h3>
        </div>

        <div className="max-w-[890px] space-y-[15px] divide-y divide-[#E5E5E5] dark:divide-gray-700">
          {similarQuestions.length > 0 ? (
            similarQuestions.map((item) => (
              <button
                className="flex w-full cursor-pointer items-center gap-4 pt-3.5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                key={item}
                onClick={() => {
                  reset();
                  handleDisplayResult(item);
                }}
              >
                <div className="flex items-center">
                  <Image
                    src="/img/arrow-circle-up-right.svg"
                    alt="footer"
                    width={24}
                    height={24}
                    className="dark:filter dark:invert"
                  />
                </div>
                <p className="text-sm sm:text-base font-light leading-[normal] text-[#1B1B16] dark:text-gray-200 [leading-trim:both] [text-edge:cap]">
                  {item}
                </p>
              </button>
            ))
          ) : (
            <>
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-600" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-600" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-600" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarTopics;
