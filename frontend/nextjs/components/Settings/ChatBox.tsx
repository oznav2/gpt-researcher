import React, { useState, useEffect } from 'react';
import ResearchForm from '../Task/ResearchForm';
import Report from '../Task/Report';
import AgentLogs from '../Task/AgentLogs';
import AccessReport from '../Task/AccessReport';
import { getApiUrl, getSiteUrl } from '../../helpers/getHost';

interface ChatBoxSettings {
  report_source: string;
  report_type: string;
  tone: string;
}

interface ChatBoxProps {
  chatBoxSettings: ChatBoxSettings;
  setChatBoxSettings: React.Dispatch<React.SetStateAction<ChatBoxSettings>>;
}
export default function ChatBox({ chatBoxSettings, setChatBoxSettings }: ChatBoxProps) {
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [report, setReport] = useState("");
  const [accessData, setAccessData] = useState({});
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const setupWebSocket = async () => {
      if (typeof window !== 'undefined') {
        const apiUrl = await getApiUrl();
        const siteUrl = await getSiteUrl();
        
        // Construct WebSocket URL
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${new URL(apiUrl).host}/ws`;
        
        const newSocket = new WebSocket(wsUrl);
        setSocket(newSocket);

        newSocket.onopen = () => {
          console.log('WebSocket connected');
        };

        newSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'logs') {
            setAgentLogs((prevLogs) => [...prevLogs, data]);
          } else if (data.type === 'report') {
            setReport((prevReport) => prevReport + data.output);
          } else if (data.type === 'path') {
            setAccessData(data);
          }
        };

        newSocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        return () => {
          newSocket.close();
        };
      }
    };

    setupWebSocket();
  }, []);

  return (
    <div>
      <main className="container" id="form">
        <ResearchForm 
          chatBoxSettings={chatBoxSettings} 
          setChatBoxSettings={setChatBoxSettings}
          defaultReportType="multi_agents" 
        />

        {agentLogs?.length > 0 ? <AgentLogs agentLogs={agentLogs} /> : ''}
        <div className="margin-div">
          {report ? <Report report={report} /> : ''}
          {/* {Object.keys(accessData).length != 0 ? <AccessReport accessData={accessData} report={report} /> : ''} */}
        </div>
      </main>
    </div>
  );
}
