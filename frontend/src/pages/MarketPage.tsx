import { Share, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Market } from "@/types/markets.types";
import { useGetAllMarkets } from "@/hooks/markets.hooks";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function MarketPage() {
  const { data, isLoading, isError } = useGetAllMarkets();
  const { marketId } = useParams();

  const [market, setMarket] = useState<Market | null>(null);

  useEffect(() => {
    const market = data?.find((m) => m.id === marketId);
    if (market) setMarket(market);
  }, [data]);

  if (!market || isLoading || isError) return <div>Loading</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 space-y-6 h-[calc(100vh-4rem)] pt-16 md:pt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{market.name}</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Share className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Market Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Ends at Block</span>
              <span className="text-xs text-muted-foreground">
                #{String(market.endSession).toString()}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-5 w-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Status</span>
              <span className="text-xs text-muted-foreground">
                {market.isEnded ? "Ended" : "Active"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-5 w-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Total Pot</span>
              <span className="text-xs text-muted-foreground">
                {market.totalPot.toLocaleString()} STX
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{market.description}</p>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Pick a side</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={market.isEnded}
                  //   onClick={() => market.onTrade && market.onTrade(id, "yes", 0)}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={market.isEnded}
                  //   onClick={() => market.onTrade && market.onTrade(id, "no", 0)}
                >
                  No
                </Button>
              </div>
            </div>
            <Separator />
            <Button className="w-full" size="lg" disabled={market.isEnded}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
