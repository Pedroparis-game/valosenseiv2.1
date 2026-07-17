import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

interface Props {
  agentName: string;
}

// Global cache for agent data to avoid redundant API calls
let agentCache: any[] | null = null;
let fetchPromise: Promise<any> | null = null;

export default function AgentImage({ agentName }: Props) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    const getAgent = async () => {
      try {
        if (!agentCache) {
          if (!fetchPromise) {
            fetchPromise = fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true").then(res => res.json());
          }
          const data = await fetchPromise;
          if (data && data.data) {
            agentCache = data.data;
          }
        }
        
        if (agentCache) {
          // Some agents might have different names (KAY/O)
          const searchName = agentName.toLowerCase().replace('/', '');
          const agent = agentCache.find((a: any) => a.displayName.toLowerCase().replace('/', '') === searchName);
          if (agent && agent.displayIcon) {
            setIconUrl(agent.displayIcon);
          }
        }
      } catch (e) {
        console.error("Failed to fetch agent icon", e);
      }
    };
    getAgent();
  }, [agentName]);

  if (!iconUrl) {
    return <div className="w-10 h-10 bg-brand-dark rounded-full border border-brand-red flex items-center justify-center shrink-0"><User size={20} className="text-brand-gray" /></div>;
  }

  return (
    <img src={iconUrl} referrerPolicy="no-referrer" alt={agentName} className="w-10 h-10 rounded-full border border-brand-red shrink-0 object-cover bg-brand-dark/50" />
  );
}
