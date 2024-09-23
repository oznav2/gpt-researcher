import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

export default function Answer({ answer }: { answer: string }) {
  async function markdownToHtml(markdown: string) {
    try {
      const result = await remark().use(html).process(markdown);
      console.log('Markdown to HTML conversion result:', result.toString());
      return result.toString();
    } catch (error) {
      console.error('Error converting Markdown to HTML:', error);
      return ''; // Handle error gracefully, return empty string or default content
    }
  }

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    markdownToHtml(answer).then((html) => setHtmlContent(html));
  }, [answer]);
  
  return (
    <div className="container flex flex-col sm:flex-row h-auto w-full shrink-0 gap-4 bg-gray-800 dark:bg-gray-900 shadow-md rounded-lg border border-solid border-[#C2C2C2] dark:border-gray-700 p-3 sm:p-5">
      <div className="w-full">
        <div className="flex items-center justify-between pb-3">
          {answer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(answer.trim());
                  toast("הדוח הועתק ללוח הזכרון של המחשב", {
                    icon: "✂️",
                  });
                }}
              >
                <Image
                  src="/img/copy-white.svg"
                  alt="footer"
                  width={20}
                  height={20}
                  className="cursor-pointer text-white dark:text-gray-300"
                />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap content-center items-center gap-[15px]">
          <div className="w-full whitespace-pre-wrap text-sm sm:text-base font-light leading-[152.5%] text-gray-900 dark:text-white">
            {answer ? (
              <div className="answer-container">
                <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <style jsx>{`
                .answer-container {
                    font-family: 'Noto Sans Hebrew', 'Libre Baskerville', serif;
                  }

                  .markdown-content {
                    margin: 0;
                    padding: 0;
                    h1, h2, h3, h4, h5, h6 {
                      font-size: 1rem;
                      font-weight: 400;
                      padding: 0;
                      line-height: 1.2;
                      margin-bottom: 0.5em;
                    }
                    h1 {
                      font-size: 1.5em;
                    }
                    h2 {
                      font-size: 1.3em;
                    }
                    h3 {
                      font-size: 1.2em;
                    }
                    h4 {
                      font-size: 1.1em;
                    }
                    p {
                      margin-bottom: 1em;
                    }
                    ul {
                      list-style-type: none;
                      padding-left: 1em;
                      margin-bottom: 1em;
                    }
                    ul > li {
                      margin-bottom: 0.5em;
                    }
                    ul > li > ul {
                      margin-left: 1em;
                      list-style-type: disc;
                    }
                    ul > li > ul > li {
                      margin-bottom: 0.3em;
                    }
                    ul > li > ul > li > ul {
                      margin-left: 1em;
                      list-style-type: circle;
                    }
                    ul > li > ul > li > ul > li {
                      margin-bottom: 0.2em;
                    }
                    @media (max-width: 640px) {
                      h1 { font-size: 1.3em; }
                      h2 { font-size: 1.2em; }
                      h3 { font-size: 1.1em; }
                      h4 { font-size: 1em; }
                    }
                  }
                `}</style>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="h-4 sm:h-6 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 sm:h-6 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 sm:h-6 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 sm:h-6 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
}
