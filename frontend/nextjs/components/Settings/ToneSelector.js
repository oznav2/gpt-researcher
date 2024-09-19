import React from 'react';

export default function ToneSelector({ tone, onToneChange }) {
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