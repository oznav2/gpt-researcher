import Image from 'next/image';
import Link from "next/link";
import { FC } from 'react';
import InputArea from "./InputArea";

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
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="landing flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-center lg:text-7xl" dir="rtl">
             חיפוש מידע שלוקח שעות<br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(to right, #9867F0, #ED4E50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                הוא עכשיו עניין של שניות              </span>
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-light text-center mx-4 sm:mx-8 md:mx-12 lg:mx-[20vw] mb-6 sm:mb-8 md:mb-10 text-gray-300 leading-relaxed" dir="rtl">
             כלי בינה מלאכותית למחקר מהיר ומקיף באינטרנט ובמסמכים שתעלו לשרת
              <span className="block mt-2">
                במקום סתם לחפש בגוגל ולקבל לינקים לקריאה נוספת, תדמיינו שעומד לרשותכם צוות מומחי על, שפותח בו זמנית מאות שאילתות באינטרנט באינספור שפות, 
                ומכין לכם תשובה מרוכזת, מקיפה, של כל המידע שנאסף בתוך דוח מסכם 
                נח לקריאה...
              </span>
            </h2>
        </div>
        
        {/* input section */}
        <div className="w-full max-w-[708px] pb-6 mt-10">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>
        {/* Suggestions section */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 sm:pb-8 md:pb-10 lg:flex-nowrap lg:justify-normal max-w-[90vw] mx-auto" dir="rtl">
          {suggestions.map((item) => (
            <div
              className="flex h-[55px] cursor-pointer items-center justify-center gap-2 rounded border border-solid border-[#d1cfcd] bg-[#d1cfcd] px-2 py-2 mb-2 transition-colors hover:bg-[#E0E0DD] text-[12px] sm:text-xs md:text-sm"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
              style={{ width: 'fit-content' }}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-base font-medium leading-[normal] text-[#3a3a39]">
                {item.name}
              </span>
            </div>
          ))}
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
    name: "האם כדאי לי להשקיע במניות של טסלה ",
    icon: "/img/stock2.svg",
  },
  {
    id: 2,
    name: "הכן לי דוח השוואה בין יעדי חופשה אפשריים בקפריסין",
    icon: "/img/hiker.svg",
  },
  {
    id: 3,
    name: "תן לי סיכום כותרות החדשות מהשבוע האחרון בישראל ",
    icon: "/img/news.svg",
  },
  {
    id: 4,
    name: "האם מצרים עלולה לפתוח במלחמה נגד ישראל",
    icon: "/img/news.svg",
  },
  {
    id: 5,
    name: "מהם הצעדים שעל מדינת ישראל לעשות על מנת לשחרר את החטופים בעזה",
    icon: "/img/news.svg",
  },
  {
    id: 6,
    name: "ערוך לי השוואה של תפקיד היועץ המשפטי לממשלה בישראל לעומת מדינות אחרות בעולם",
    icon: "/img/news.svg",
  },
];

export default Hero;
