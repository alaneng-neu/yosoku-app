import { ClarityMarket, Market } from "@/types/markets.types";

export const marketTransformer = (market: ClarityMarket): Market => {
  // TODO
  return {
    ...market.value,
  };
};
