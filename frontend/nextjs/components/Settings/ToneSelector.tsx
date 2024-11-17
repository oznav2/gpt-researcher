import React, { ChangeEvent } from 'react';

interface ToneSelectorProps {
  tone: string;
  onToneChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}
export default function ToneSelector({ tone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="form-group">
      <label htmlFor="tone" className="agent_question">Tone </label>
      <select name="tone" id="tone" value={tone} onChange={onToneChange} className="form-control" required>
        <option value="Objective">Objective - Impartial and unbiased presentation of facts and findings</option>
        <option value="Formal">Formal - Adheres to academic standards with sophisticated language and structure</option>
        <option value="Analytical">Analytical - Critical evaluation and detailed examination of data and theories</option>
        <option value="Persuasive">Persuasive - Convincing the audience of a particular viewpoint or argument</option>
        <option value="Informative">Informative - Providing clear and comprehensive information on a topic</option>
        <option value="Explanatory">Explanatory - Clarifying complex concepts and processes</option>
        <option value="Descriptive">Descriptive - Detailed depiction of phenomena, experiments, or case studies</option>
        <option value="Critical">Critical - Judging the validity and relevance of the research and its conclusions</option>
        <option value="Comparative">Comparative - Juxtaposing different theories, data, or methods to highlight differences and similarities</option>
        <option value="Speculative">Speculative - Exploring hypotheses and potential implications or future research directions</option>
        <option value="Reflective">Reflective - Considering the research process and personal insights or experiences</option>
        <option value="Narrative">Narrative - Telling a story to illustrate research findings or methodologies</option>
        <option value="Humorous">Humorous - Light-hearted and engaging, usually to make the content more relatable</option>
        <option value="Optimistic">Optimistic - Highlighting positive findings and potential benefits</option>
        <option value="Pessimistic">Pessimistic - Focusing on limitations, challenges, or negative outcomes</option>
      </select>
    </div>
  );
}
import React, { ChangeEvent } from 'react';

interface ToneSelectorProps {
  tone: string;
  onToneChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}
export default function ToneSelector({ tone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="form-group">
      <label htmlFor="tone" className="agent_question">באיזה סגנון היית רוצה שדוח המחקר יבוצע?</label>
      <select name="tone" id="tone" value={tone} onChange={onToneChange} className="form-control" required>
        <option value="Objective">אוביקטיבי - הצגה בלתי משוחדת וחסרת פניות של עובדות וממצאים.</option>
        <option value="Formal">פורמלי - הצגה אנליטית של הממצאים באופן מדעי</option>
        <option value="Analytical">אנליטי - הערכה ביקורתית ובחינה מעמיקה של נתונים ותיאוריות</option>
        <option value="Persuasive">משכנע - שכנוע הקהל בנוגע לנקודת מבט או טיעון מסוים</option>
        <option value="Informative">מֵידָעִי - מתן מידע ברור ומקיף על נושא</option>
        <option value="Explanatory">הסברתי - הבהרת מושגים ותהליכים מורכבים</option>
        <option value="Descriptive">תיאורי - תיאור מפורט של תופעות, ניסויים או מקרים</option>
        <option value="Critical">ביקורתי - שיפוט לגבי תקפות ומידת הרלוונטיות של המחקר ושל מסקנותיו</option>
        <option value="Comparative">השוואתי - להציב זה לצד זה תיאוריות, נתונים או שיטות שונות כדי להדגיש הבדלים ודמיון</option>
        <option value="Speculative">שׁוֹפְרָני - חקר השערות והשלכות פוטנציאליות או כיווני מחקר עתידיים</option>
        <option value="Reflective">רפלקטיבי - התבוננות על תהליך המחקר ותובנות או חוויות אישיות</option>
        <option value="Narrative">נרטיבי - סיפור כדי להמחיש ממצאי מחקר או מתודולוגיות</option>
        <option value="Humorous">הומוריסטי - קליל ומעניין, בדרך כלל כדי להפוך את התוכן ליותר נגיש</option>
        <option value="Optimistic">אופטימי - הדגשת ממצאים חיוביים ותועלות פוטנציאליות</option>
        <option value="Pessimistic">פסימיסטי - התמקדות במגבלות, באתגרים או בתוצאות שליליות</option>
      </select>
    </div>
  );
}