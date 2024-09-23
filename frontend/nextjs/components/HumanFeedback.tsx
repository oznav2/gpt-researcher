// /multi_agents/frontend/components/HumanFeedback.tsx

import React, { useState } from 'react';

interface HumanFeedbackProps {
  websocket: WebSocket | null;
  onFeedbackSubmit: (feedback: string | null) => void;
  questionForHuman: string;
}

const HumanFeedback: React.FC<HumanFeedbackProps> = ({ questionForHuman, websocket, onFeedbackSubmit }) => {
  const [userFeedback, setUserFeedback] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFeedbackSubmit(userFeedback === '' ? null : userFeedback);
    setUserFeedback('');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">נדרשת תגובת המשתמש</h3>
      <p className="mb-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">{questionForHuman}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded-md text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          placeholder="כתוב כאן אם יש לך הערות או השאר ריק כדי להתעלם"
          rows={4}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm sm:text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          שלח תגובה
        </button>
      </form>
    </div>
  );
};

export default HumanFeedback;