import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Market } from "@/types/markets.types";

interface MarketProps {
  market: Market;
}

const MarketCard: React.FC<MarketProps> = ({ market }: MarketProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const onVote = (id: string, vote: string) => {
    // TODO
  };

  const handleVote = async (vote: "yes" | "no") => {
    setIsVoting(true);
    try {
      await onVote(market.id, vote);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{market.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{market.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            className="w-24 font-semibold bg-blue-100 text-blue-700 border-blue-500"
            disabled={market.isEnded || isVoting}
            onClick={() => handleVote("yes")}
          >
            Yes
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-24 font-semibold bg-red-100 text-red-700 border-red-500"
            disabled={market.isEnded || isVoting}
            onClick={() => handleVote("no")}
          >
            No
          </Button>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">Total Volume</span>
          <span className="font-mono font-medium">{market.totalPot} STX</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
