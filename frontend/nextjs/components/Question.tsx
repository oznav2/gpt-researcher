import Image from "next/image";

interface QuestionProps {
  question: string;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div className="container flex flex-col sm:flex-row w-full items-start gap-2 sm:gap-3 pt-2 sm:pt-4">
      <div className="flex w-fit items-center gap-2 sm:gap-4">
        <Image
          src={"/img/message-question-circle.svg"}
          alt="message"
          width={30}
          height={30}
          className="size-[20px] sm:size-[24px] dark:filter dark:invert"
        />
        <p className="font-bold uppercase leading-[152%] text-gray-800 dark:text-gray-200 text-sm sm:text-base">
          נושא המחקר:
        </p>
      </div>
      <div className="grow text-amber-600">&quot;{question}&quot;</div>
    </div>
  );
};

export default Question;