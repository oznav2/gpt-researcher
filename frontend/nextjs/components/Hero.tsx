import Image from 'next/image';
import { FC } from 'react';
import InputArea from "./InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
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
            <h1 className="text-4xl font-extrabold text-center lg:text-7xl">
              אמרו שלום ולהתראות <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(to right, #9867F0, #ED4E50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                לאינסוף שעות מבוזבות של חיפוש מידע
              </span>
            </h1>
            <h2 className="text-xl font-light text-center ml-[20vw] mr-[20vw] mb-10 text-gray-300">
              הכירו את עמית המחקר בשרת של אילן, כלי מבוסס בינה חכמה שיאפשר לכם לקבל מידע מקיף ותובנות על כמעט כל נושא שתבחרו
              תדמיינו מנוע חיפוש עם בינה חכמה המורכב מעשרות מומחים, שיש לו את כל הידע האנושי הכתוב בכל נושא, 
              שפותח עשרות דפי אינטרנט בו זמנית, שקורא עבורכם מאות מסמכים ומקורות באינספור שפות ומכין לכם תשובה מרוכזת, מקיפה, הבדוקה על ידי צוות המומחים הכי רציני שיכולתם לחלום עליו
              והכל חינם..ותוך דקות
            </h2>
        </div>
        

        {/* input section */}
        <div className="w-full max-w-[708px] pb-6 mt-20">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>

        {/* Suggestions section */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-[30px] lg:flex-nowrap lg:justify-normal">
          {suggestions.map((item) => (
            <div
              className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded border border-solid border-[#C1C1C1] bg-[#EDEDEA] px-2.5 py-2"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-sm font-light leading-[normal] text-[#1B1B16]">
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
