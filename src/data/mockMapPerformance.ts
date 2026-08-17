import { MapDashboardData } from "../types";

export const mockMapPerformanceData: MapDashboardData[] = [
  {
    mapId: "ascent",
    mapName: "Ascent",
    images: {
      splash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
      radar: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png"
    },
    stats: {
      winRate: 58.5,
      acs: 235.4,
      kdRatio: 1.15
    },
    topAgents: [
      { name: "Omen", iconUrl: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png" },
      { name: "Jett", iconUrl: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png" },
      { name: "Sova", iconUrl: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png" }
    ]
  },
  {
    mapId: "bind",
    mapName: "Bind",
    images: {
      splash: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
      radar: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png"
    },
    stats: {
      winRate: 42.1,
      acs: 198.2,
      kdRatio: 0.92
    },
    topAgents: [
      { name: "Viper", iconUrl: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png" },
      { name: "Raze", iconUrl: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-8e18-284bd4a126ba/displayicon.png" },
      { name: "Fade", iconUrl: "https://media.valorant-api.com/agents/dade69b4-415a-8cb1-65ce-0b8ce569b536/displayicon.png" }
    ]
  }
];
