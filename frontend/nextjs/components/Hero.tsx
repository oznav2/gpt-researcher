import Image from "next/image";
import { FC } from "react";
import InputArea from "./ResearchBlocks/elements/InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: (query : string) => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="w-full px-4 sm:px-6 pt-24 sm:pt-28">
      <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="landing flex flex-col items-center">
            <h1 className="text-xl sm:text-4xl lg:text-7xl font-extrabold text-center leading-tight">
              חיפוש מידע שעשוי לקחת שעות <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(to right, #9867F0, #ED4E50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1',
                }}
                className="block mt-2 sm:mt-3"
              >
                הוא עכשיו עניין של דקות
              </span>
            </h1>
            <h2 className="text-xs sm:text-xl font-light text-center px-4 sm:px-4 mb-4 sm:mb-10 text-gray-300 mt-4" dir="rtl">
              כלי בינה מלאכותית למחקר מהיר ומקיף באינטרנט ובמסמכים שתעלו לשרת
              <span className="block mt-2">
                במקום סתם לחפש בגוגל ולקבל לינקים לקריאה נוספת, תדמיינו שעומד לרשותכם צוות מומחי על, שפותח בו זמנית מאות שאילתות באינטרנט באינספור שפות,
                ומכין לכם תשובה מרוכזת, מקיפה, של כל המידע שנאסף בתוך דוח מסכם
                נח לקריאה...
              </span>
            </h2>
          </div>

          {/* Input section - improved mobile spacing */}
          <div className="w-full max-w-[708px] pb-4 sm:pb-6 px-2 sm:px-0 mt-4">
            <InputArea
              promptValue={promptValue}
              setPromptValue={setPromptValue}
              handleSubmit={handleDisplayResult}
            />
          </div>

          {/* Suggestions section - improved mobile layout */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pb-4 sm:pb-[30px] px-2 sm:px-0">
            {suggestions.map((item) => (
              <div
                className="flex h-[32px] sm:h-[35px] cursor-pointer items-center justify-center gap-[5px] 
                rounded border border-solid border-[#C1C1C1] bg-[#EDEDEA] px-2 sm:px-2.5 py-1.5 sm:py-2"
                onClick={() => handleClickSuggestion(item?.name)}
                key={item.id}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={16}
                  height={14}
                  className="w-[16px] sm:w-[18px]"
                />
                <span className="text-xs sm:text-sm font-light leading-[normal] text-[#1B1B16]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "נתח לי את מניית טסלה בבורסה ",
    icon: "/img/stock2.svg",
  },
  {
    id: 2,
    name: "תכנן לי טיול של שבוע בפאפוס קפריסין ",
    icon: "/img/hiker.svg",
  },
  {
    id: 3,
    name: "מהן כותרות החדשות ב ",
    icon: "/img/news.svg",
  },
];

export default Hero;
