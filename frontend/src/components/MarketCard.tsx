import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Market } from "@/types/markets.types";

interface MarketProps {
  market?: Market;
  isLoading?: boolean;
}

const MarketCard: React.FC<MarketProps> = ({
  market,
  isLoading,
}: MarketProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const onVote = (id: string, vote: string) => {
    // TODO
  };

  if (!market || isLoading)
    return (
      <Card className="w-full max-w-xl">
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="loader"></div>
          {/* Placeholder for loader animation */}
        </div>
      </Card>
    );

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
          <span className="font-mono font-medium">
            {String(market.totalPot).toString()} STX
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
