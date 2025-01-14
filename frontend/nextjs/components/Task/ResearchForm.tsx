import React, { useState, useEffect } from "react";
import FileUpload from "../Settings/FileUpload";
import ToneSelector from "../Settings/ToneSelector";

interface ChatBoxSettings {
  report_type: string;
  report_source: string;
  tone: string;
}

interface ResearchFormProps {
  chatBoxSettings: ChatBoxSettings;
  setChatBoxSettings: React.Dispatch<React.SetStateAction<ChatBoxSettings>>;
  onFormSubmit?: (
    task: string,
    reportType: string,
    reportSource: string,
  ) => void;
  defaultReportType: string;
}

export default function ResearchForm({
  chatBoxSettings,
  setChatBoxSettings,
  onFormSubmit,
  defaultReportType,
}: ResearchFormProps) {
  const [task, setTask] = useState(""); // You can use this to capture any specific task data if needed

  // Destructure necessary fields from chatBoxSettings
  let { report_type, report_source, tone } = chatBoxSettings;

  const onFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setChatBoxSettings((prevSettings: any) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const onToneChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setChatBoxSettings((prevSettings: any) => ({
      ...prevSettings,
      tone: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(task, report_type, report_source); // Trigger the onFormSubmit prop when form is submitted
    } else {
      console.warn("onFormSubmit is not defined");
    }
  };

  useEffect(() => {
    // Set default report type only if report_type is empty (initial mount)
    if (!chatBoxSettings.report_type) {
      setChatBoxSettings((prevSettings) => ({
        ...prevSettings,
        report_type: defaultReportType,
      }));
    }
  }, [defaultReportType, setChatBoxSettings, chatBoxSettings.report_type]);

  return (
    <form
      method="POST"
      className="report_settings mt-3"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="report_type" className="agent_question">
          סוג המחקר{" "}
        </label>
        <select
          name="report_type"
          value={report_type}
          onChange={onFormChange}
          className="form-control"
          required
        >

          <option value="multi_agents">מחקר מרובה סוכנים</option>
          <option value="research_report">
            סיכום - קצר ומהיר (~2 דקות)
          </option>
          <option value="detailed_report">
            מחקר מפורט - מעמיק וארוך (~5 דקות)
          </option>

        </select>
      </div>
      <div className="form-group">
        <label htmlFor="report_source" className="agent_question">
          מקור המחקר{" "}
        </label>
        <select
          name="report_source"
          value={report_source}
          onChange={onFormChange}
          className="form-control"
          required
        >
          <option value="web">האינטרנט</option>
          <option value="local">המסמכים שלי</option>
          <option value="hybrid">משולב</option>
        </select>
      </div>
      {/* Conditional file upload if the report source is 'local' or 'hybrid' */}
      {report_source === "local" || report_source === "hybrid" ? (
        <FileUpload />
      ) : null}
      {/* ToneSelector for changing the tone */}
      <ToneSelector tone={tone} onToneChange={onToneChange} />

    </form>
  );
}
