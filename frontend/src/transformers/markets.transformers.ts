import { ClarityMarket, Market } from "@/types/markets.types";

export const marketTransformer = (market: ClarityMarket): Market => {
  return {
    id: market.marketId.value,
    name: market.name.value,
    description: market.description.value,
    endSession: market.endSession.value,
    isEnded: market.isEnded.type,
    totalPot: market.noPot.value + market.yesPot.value,
  };
};
