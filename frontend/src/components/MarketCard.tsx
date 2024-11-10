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
  if (!market || isLoading)
    return (
      <Card className="w-full max-w-xl h-64">
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="loader"></div>
        </div>
      </Card>
    );

  return (
    <div className="h-px">
      <Card className="w-full max-w-xl h-64 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-between">
          <CardHeader className="max-h-24">
            <CardTitle className="text-xl font-bold">{market.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {market.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex justify-center gap-4 mt-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-24 font-semibold bg-blue-100 text-blue-700 border-blue-500"
                disabled={market.isEnded}
              >
                Yes
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-24 font-semibold bg-red-100 text-red-700 border-red-500"
                disabled={market.isEnded}
              >
                No
              </Button>
            </div>
          </CardContent>
        </div>
        <div className="flex justify-between items-center pt-2 border-t px-4 pb-4">
          <span className="text-sm text-muted-foreground">Total Volume</span>
          <span className="font-mono font-medium">
            {String(Number(market.totalPot) / 1_000_000).toString()} STX
          </span>
        </div>
      </Card>
    </div>
  );
};

export default MarketCard;
