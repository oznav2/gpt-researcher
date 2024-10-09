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
                <label htmlFor="report_type" className="agent_question">סוג הדוח המבוקש </label>
                <select name="report_type" value={report_type} onChange={onFormChange} className="form-control" required>
                    <option value="multi_agents">דוח מרובה מומחים</option>
                    <option value="research_report">תקציר (לוקח כ 2 דקות)</option>
                    <option value="detailed_report">מפורט (לוקח כ 5 דקות)</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="report_source" className="agent_question">מקורות לשימוש במחקר </label>
                <select name="report_source" value={report_source} onChange={onFormChange} className="form-control" required>
                    <option value="web">באינטרנט</option>
                    <option value="local">במסמכים</option>
                    <option value="hybrid">משולב</option>
                </select>
            </div>
            {report_source === 'local' || report_source === 'hybrid' ? <FileUpload /> : null}
            <ToneSelector tone={tone} onToneChange={onToneChange} /> {/* Add ToneSelector component */}
        </form>
    );
}