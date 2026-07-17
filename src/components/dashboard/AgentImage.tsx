import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

interface Props {
  agentName: string;
}

// Global cache for agent data to avoid redundant API calls
let agentCache: any[] | null = null;
let fetchPromise: Promise<any> | null = null;

const STATIC_AGENT_ICONS: Record<string, string> = {
  omen: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png",
  jett: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png",
  raze: "https://media.valorant-api.com/agents/f7ae25e2-441e-0e6a-d7fb-71a677b12d94/displayicon.png",
  reyna: "https://media.valorant-api.com/agents/a3dead88-4730-77d3-9d8d-cd91503c225a/displayicon.png",
  sage: "https://media.valorant-api.com/agents/5685d1c1-4ad1-8c34-974d-10ced4014c4d/displayicon.png",
  sova: "https://media.valorant-api.com/agents/ded3520f-40db-ab1d-2a3f-acbb0be35405/displayicon.png",
  viper: "https://media.valorant-api.com/agents/707eab7f-4beb-82a4-0704-92f32f34225e/displayicon.png",
  killjoy: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98740/displayicon.png",
  cypher: "https://media.valorant-api.com/agents/115d613b-4fb7-136b-4d11-007101f5919e/displayicon.png",
  brimstone: "https://media.valorant-api.com/agents/9f0d7bfa-4435-4310-adeb-dd316401a30f/displayicon.png",
  phoenix: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-007db77f4cbd/displayicon.png",
  breach: "https://media.valorant-api.com/agents/30e9a267-4351-8ca5-3c5f-b8a4741a4b9f/displayicon.png",
  skye: "https://media.valorant-api.com/agents/6f2a6fac-44b9-87d7-2454-d0be5d58a528/displayicon.png",
  yoru: "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png",
  astra: "https://media.valorant-api.com/agents/441d8e12-41c1-47e4-36ac-978ef3fb332e/displayicon.png",
  kayo: "https://media.valorant-api.com/agents/601dbbe7-43b0-d775-6a85-04b301980345/displayicon.png",
  kay_o: "https://media.valorant-api.com/agents/601dbbe7-43b0-d775-6a85-04b301980345/displayicon.png",
  chamber: "https://media.valorant-api.com/agents/22697a5c-4ad9-734f-d0d7-5e97e1c504cd/displayicon.png",
  neon: "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd2-a7e3-08b9e74eb69a/displayicon.png",
  fade: "https://media.valorant-api.com/agents/deadf12e-4074-17b1-e2fb-af92ac424d9c/displayicon.png",
  harbor: "https://media.valorant-api.com/agents/95b58a24-443a-e3c3-e5e3-8d9e212ac6b8/displayicon.png",
  gekko: "https://media.valorant-api.com/agents/e370fa57-4757-3604-36a7-a840e4f48866/displayicon.png",
  deadlock: "https://media.valorant-api.com/agents/cc8b3908-41ec-84d2-2779-7280a02465b5/displayicon.png",
  iso: "https://media.valorant-api.com/agents/1dbf2eff-4398-984f-9df9-b5bc0791a2e0/displayicon.png",
  clove: "https://media.valorant-api.com/agents/e53b6551-4eb5-bc13-e2fa-af92ac424d9c/displayicon.png",
  vyse: "https://media.valorant-api.com/agents/1dbf2eff-4398-984f-9df9-b5bc0791a2e0/displayicon.png"
};

export default function AgentImage({ agentName }: Props) {
  const [iconUrl, setIconUrl] = useState<string | null>(() => {
    const key = agentName.toLowerCase().replace('/', '').replace('-', '_').trim();
    return STATIC_AGENT_ICONS[key] || null;
  });

  useEffect(() => {
    // Se já resolvemos com a imagem estática mapeada, não precisamos buscar dinamicamente
    if (iconUrl) return;

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
  }, [agentName, iconUrl]);

  if (!iconUrl) {
    return <div className="w-10 h-10 bg-brand-dark rounded-full border border-brand-red flex items-center justify-center shrink-0"><User size={20} className="text-brand-gray" /></div>;
  }

  return (
    <img src={iconUrl} referrerPolicy="no-referrer" alt={agentName} className="w-10 h-10 rounded-full border border-brand-red shrink-0 object-cover bg-brand-dark/50" />
  );
}
