export interface ClarityMarket {
  marketId: { type: string; value: string };
  name: { type: string; value: string };
  description: { type: string; value: string };

  endSession: { type: string; value: number };
  isEnded: { type: boolean };

  betters: { type: string; value: [] };
  noPot: { type: string; value: number };
  noVoters: { type: string; value: number };
  yesPot: { type: string; value: number };
  yesVoters: { type: string; value: number };
}

export interface Market {
  id: string;
  name: string;
  description: string;

  endSession: number; // What block this market ends
  isEnded: boolean;

  totalPot: number;
}
