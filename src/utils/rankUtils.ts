/**
 * Mapeamento direto estático dos ranks oficiais para o CDN oficial do Valorant API.
 * Isso garante que mesmo se a requisição da API falhar ou demorar, a imagem carregará instantaneamente.
 */
export function getStaticRankIcon(rankName: string): string {
  const fallbackIcon = "/ranks/iron_1.svg"; // Fallback para iron 1
  if (!rankName || rankName.trim() === "" || rankName.toLowerCase() === "sem rank" || rankName.toLowerCase() === "unranked") {
    return fallbackIcon;
  }

  const name = rankName.toLowerCase().trim();
  
  if (name.includes("iron 1") || name === "ferro 1") return "/ranks/iron_1.svg";
  if (name.includes("iron 2") || name === "ferro 2") return "/ranks/iron_2.svg";
  if (name.includes("iron 3") || name === "ferro 3") return "/ranks/iron_3.svg";
  
  if (name.includes("bronze 1")) return "/ranks/bronze_1.svg";
  if (name.includes("bronze 2")) return "/ranks/bronze_2.svg";
  if (name.includes("bronze 3")) return "/ranks/bronze_3.svg";
  
  if (name.includes("silver 1") || name === "prata 1") return "/ranks/silver_1.svg";
  if (name.includes("silver 2") || name === "prata 2") return "/ranks/silver_2.svg";
  if (name.includes("silver 3") || name === "prata 3") return "/ranks/silver_3.svg";
  
  if (name.includes("gold 1") || name === "ouro 1") return "/ranks/gold_1.svg";
  if (name.includes("gold 2") || name === "ouro 2") return "/ranks/gold_2.svg";
  if (name.includes("gold 3") || name === "ouro 3") return "/ranks/gold_3.svg";
  
  if (name.includes("platinum 1") || name === "platina 1") return "/ranks/platinum_1.svg";
  if (name.includes("platinum 2") || name === "platina 2") return "/ranks/platinum_2.svg";
  if (name.includes("platinum 3") || name === "platina 3") return "/ranks/platinum_3.svg";
  
  if (name.includes("diamond 1") || name === "diamante 1") return "/ranks/diamond_1.svg";
  if (name.includes("diamond 2") || name === "diamante 2") return "/ranks/diamond_2.svg";
  if (name.includes("diamond 3") || name === "diamante 3") return "/ranks/diamond_3.svg";
  
  if (name.includes("ascendant 1") || name === "ascendente 1") return "/ranks/ascendant_1.svg";
  if (name.includes("ascendant 2") || name === "ascendente 2") return "/ranks/ascendant_2.svg";
  if (name.includes("ascendant 3") || name === "ascendente 3") return "/ranks/ascendant_3.svg";
  
  if (name.includes("immortal 1") || name === "imortal 1") return "/ranks/immortal_1.svg";
  if (name.includes("immortal 2") || name === "imortal 2") return "/ranks/immortal_2.svg";
  if (name.includes("immortal 3") || name === "imortal 3") return "/ranks/immortal_3.svg";
  
  if (name.includes("radiant") || name === "radiante") return "/ranks/radiant.svg";

  return fallbackIcon;
}

let tiersCache: any[] | null = null;
let tiersFetchPromise: Promise<any> | null = null;

/**
 * Busca de forma inteligente e cacheada os ícones de ranks oficiais do Valorant.
 * Usa o mapeador estático inteligente como primeira escolha rápida.
 */
export async function getOfficialRankIcon(rankName: string): Promise<string> {
  return getStaticRankIcon(rankName);
}

