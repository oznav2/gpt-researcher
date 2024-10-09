import Image from 'next/image';

interface SubQuestionsProps {
  metadata: string[];
  handleClickSuggestion: (value: string) => void;
}

const SubQuestions: React.FC<SubQuestionsProps> = ({ metadata, handleClickSuggestion }) => {
  return (
    <div className="container flex flex-col sm:flex-row w-full items-start gap-3 pt-2 sm:pt-4">
      <div className="flex w-fit items-center gap-2 sm:gap-4">
        <Image
          src={"/img/thinking.svg"}
          alt="thinking"
          width={30}
          height={30}
          className="size-[20px] sm:size-[24px] dark:filter dark:invert"
        />
      </div>
      <div className="grow text-white">
        <p className="pr-5 font-bold leading-[152%] text-white pb-[30px]">
          שוקד על הנושא ומנתח את המידע מהמקורות במספר זוויות
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-4 sm:pb-[20px]">
          {metadata.map((item, subIndex) => (
            <div
              className="flex cursor-pointer items-center justify-center gap-[5px] rounded-full border border-solid border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-2 sm:px-2.5 py-1.5 sm:py-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleClickSuggestion(item)}
              key={`${item}-${subIndex}`}
            >
              <span className="text-xs sm:text-sm font-light leading-[normal] text-gray-800 dark:text-gray-200">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubQuestions;