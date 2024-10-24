import React from 'react';

export default function Report({report}:any) {

    return (
        <div>
            <h2>דוח תוצאות המחקר הסופי</h2>
            <div id="reportContainer">
                {/* <MarkdownView
                    markdown={report}
                    options={{ tables: true, emoji: true }}
                /> */}
            </div>
        </div>
    );
};