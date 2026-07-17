/**
 * Mapeamento direto estático dos ranks oficiais para o CDN oficial do Valorant API.
 * Isso garante que mesmo se a requisição da API falhar ou demorar, a imagem carregará instantaneamente.
 */
export function getStaticRankIcon(rankName: string): string {
  const fallbackIcon = "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png";
  if (!rankName || rankName.trim() === "" || rankName.toLowerCase() === "sem rank" || rankName.toLowerCase() === "unranked") {
    return fallbackIcon;
  }

  const name = rankName.toLowerCase().trim();
  let tierNumber = 0;

  if (name.includes("iron 1") || name === "ferro 1") tierNumber = 3;
  else if (name.includes("iron 2") || name === "ferro 2") tierNumber = 4;
  else if (name.includes("iron 3") || name === "ferro 3") tierNumber = 5;
  else if (name.includes("bronze 1")) tierNumber = 6;
  else if (name.includes("bronze 2")) tierNumber = 7;
  else if (name.includes("bronze 3")) tierNumber = 8;
  else if (name.includes("silver 1") || name === "prata 1") tierNumber = 9;
  else if (name.includes("silver 2") || name === "prata 2") tierNumber = 10;
  else if (name.includes("silver 3") || name === "prata 3") tierNumber = 11;
  else if (name.includes("gold 1") || name === "ouro 1") tierNumber = 12;
  else if (name.includes("gold 2") || name === "ouro 2") tierNumber = 13;
  else if (name.includes("gold 3") || name === "ouro 3") tierNumber = 14;
  else if (name.includes("platinum 1") || name === "platina 1") tierNumber = 15;
  else if (name.includes("platinum 2") || name === "platina 2") tierNumber = 16;
  else if (name.includes("platinum 3") || name === "platina 3") tierNumber = 17;
  else if (name.includes("diamond 1") || name === "diamante 1") tierNumber = 18;
  else if (name.includes("diamond 2") || name === "diamante 2") tierNumber = 19;
  else if (name.includes("diamond 3") || name === "diamante 3") tierNumber = 20;
  else if (name.includes("ascendant 1") || name === "ascendente 1") tierNumber = 21;
  else if (name.includes("ascendant 2") || name === "ascendente 2") tierNumber = 22;
  else if (name.includes("ascendant 3") || name === "ascendente 3") tierNumber = 23;
  else if (name.includes("immortal 1") || name === "imortal 1") tierNumber = 24;
  else if (name.includes("immortal 2") || name === "imortal 2") tierNumber = 25;
  else if (name.includes("immortal 3") || name === "imortal 3") tierNumber = 26;
  else if (name.includes("radiant") || name === "radiante") tierNumber = 27;

  if (tierNumber > 0) {
    return `https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/${tierNumber}/largeicon.png`;
  }

  return fallbackIcon;
}

let tiersCache: any[] | null = null;
let tiersFetchPromise: Promise<any> | null = null;

/**
 * Busca de forma inteligente e cacheada os ícones de ranks oficiais do Valorant.
 * Usa o mapeador estático inteligente como primeira escolha rápida.
 */
export async function getOfficialRankIcon(rankName: string): Promise<string> {
  const staticIcon = getStaticRankIcon(rankName);
  const fallbackIcon = "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png";

  if (staticIcon !== fallbackIcon) {
    return staticIcon;
  }

  try {
    if (!tiersCache) {
      if (!tiersFetchPromise) {
        tiersFetchPromise = fetch("https://valorant-api.com/v1/competitivetiers")
          .then((res) => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
          })
          .catch((err) => {
            console.error("Erro ao carregar competitivetiers da Valorant API:", err);
            return null;
          });
      }
      const data = await tiersFetchPromise;
      if (data && data.data && data.data.length > 0) {
        const activeTiersGroup = data.data[data.data.length - 1];
        tiersCache = activeTiersGroup.tiers || [];
      }
    }

    if (tiersCache) {
      const searchName = rankName.toLowerCase().trim();
      const matched = tiersCache.find((t: any) => t.tierName.toLowerCase() === searchName);
      if (matched && matched.largeIcon) {
        return matched.largeIcon;
      }
    }
  } catch (error) {
    console.error("Erro na função getOfficialRankIcon:", error);
  }

  return staticIcon;
}

