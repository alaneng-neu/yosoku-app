import { Share, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Market } from "@/types/markets.types";
import {
  useBetOnMarket,
  useCurrentStacksBlock,
  useEndMarketSession,
  useGetAllMarkets,
} from "@/hooks/markets.hooks";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { useCurrentUserSession } from "@/hooks/user.hooks";

export default function MarketPage() {
  const { data, isLoading, isError } = useGetAllMarkets();
  const { marketId } = useParams();
  const { mutateAsync: endMarketSession } = useEndMarketSession();
  const [betAmount, setBetAmount] = useState(1);
  const [betSide, setBetSide] = useState<1 | 0>(1);
  const { mutateAsync: bet } = useBetOnMarket();
  const { data: currentBlockHeight } = useCurrentStacksBlock();

  const userSession = useCurrentUserSession();

  const [market, setMarket] = useState<Market | null>(null);

  useEffect(() => {
    const market = data?.find((m) => m.id === marketId);
    if (market) setMarket(market);
  }, [data, marketId]);

  if (!marketId || !market || !currentBlockHeight || isLoading || isError)
    return <div>Loading</div>;

  const handleEndMarketSession = async () => {
    try {
      const formData = new FormData();
      formData.append("marketId", marketId);

      await endMarketSession(formData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBet = async () => {
    try {
      const formData = new FormData();
      formData.append("marketId", marketId);
      formData.append("yesVote", betSide.toString());
      formData.append("betAmount", betAmount.toString());

      await bet({
        formData,
        walletSender: userSession.loadUserData().profile.stxAddress.testnet,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isMarketEnded =
    market.isEnded || currentBlockHeight >= market.endSession;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto h-[calc(100vh-7rem)] mt-16 md:mt-28 flex flex-col justify-center">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{market.name}</h1>
            </div>
            <div className="flex justify-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <Share className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant={"destructive"} onClick={handleEndMarketSession}>
                End Market Session
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Ends at Block</span>
                <span className="text-xs text-muted-foreground">
                  #{String(market.endSession).toString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Blocks Remaining</span>
                <span className="text-xs text-muted-foreground">
                  {String(
                    Math.max(0, Number(market.endSession) - currentBlockHeight)
                  ).toString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-5 w-5 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
                <span className="text-xs text-muted-foreground">
                  {isMarketEnded ? "Ended" : "Active"}
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
                  min="1"
                  value={String(betAmount)}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Pick a side</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full transition duration-200 ease-in-out",
                      betSide === 1
                        ? "shadow-md shadow-inner bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                        : "hover:bg-blue-50"
                    )}
                    disabled={isMarketEnded}
                    onClick={() => setBetSide(1)}>
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full transition duration-200 ease-in-out",
                      betSide === 0
                        ? "shadow-md shadow-inner bg-red-100 border-red-500 text-red-700 font-semibold"
                        : "hover:bg-red-50"
                    )}
                    disabled={isMarketEnded}
                    onClick={() => setBetSide(0)}>
                    No
                  </Button>
                </div>
              </div>
              <Separator />
              <Button
                className="w-full"
                size="lg"
                disabled={isMarketEnded || Number(betAmount) < 1}
                onClick={handleBet}>
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
