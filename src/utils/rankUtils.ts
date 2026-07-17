let tiersCache: any[] | null = null;
let tiersFetchPromise: Promise<any> | null = null;

/**
 * Busca de forma inteligente e cacheada os ícones de ranks oficiais do Valorant.
 * Isso garante que todas as imagens sejam carregadas direto do CDN oficial do jogo,
 * prevenindo imagens quebradas ou falhas de caminhos relativos locais no Vercel.
 */
export async function getOfficialRankIcon(rankName: string): Promise<string> {
  const fallbackIcon = "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png";

  if (!rankName || rankName.trim() === "" || rankName.toLowerCase() === "sem rank" || rankName.toLowerCase() === "unranked") {
    return fallbackIcon;
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
        // O último conjunto de tiers no array costuma ser o mais atualizado (Episódio mais recente)
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

  return fallbackIcon;
}
