// multi_agents/gpt_researcher_nextjs/components/Task/ResearchForm.js

import React from 'react';
import FileUpload from '../Settings/FileUpload';
import ToneSelector from '../Settings/ToneSelector'; // Import ToneSelector

export default function ResearchForm({ chatBoxSettings, setChatBoxSettings }) {
    console.log('chatBoxSettings', chatBoxSettings);

    let { report_type, report_source, tone } = chatBoxSettings;

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setChatBoxSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const onToneChange = (e) => {
        const { value } = e.target;
        setChatBoxSettings((prevSettings) => ({
            ...prevSettings,
            tone: value,
        }));
    };

    return (
        <form method="POST" className="mt-3 report_settings">
            <div className="form-group">
                <label htmlFor="report_type" className="agent_question">מהו הנושא שתרצה לחקור או לבדוק לעומק?</label>
                <select name="report_type" value={report_type} onChange={onFormChange} className="form-control" required>
                    <option value="multi_agents">מחקר מרובה סוכני בינה מלאכותית</option>
                    <option value="research_report">סיכום קצר ותמציתי (2 דקות בערך עד לסיום התהליך)</option>
                    <option value="detailed_report">פורט - וכולל מחקר עמוק ורווי פרטים (5 דקות ולפעמים יותר עד לסיום התהליך - סבלנות)</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="report_source" className="agent_question">באילו מקורות מידע עליי להשתמש כדי לבצע את המחקר שביקשת?</label>
                <select name="report_source" value={report_source} onChange={onFormChange} className="form-control" required>
                    <option value="web">באינטרנט</option>
                    <option value="local">במסמכים שלי</option>
                    <option value="hybrid">היברידי - חיפוש משולב</option>
                </select>
            </div>
            {report_source === 'local' || report_source === 'hybrid' ? <FileUpload /> : null}
            <ToneSelector tone={tone} onToneChange={onToneChange} /> {/* Add ToneSelector component */}
        </form>
    );
}