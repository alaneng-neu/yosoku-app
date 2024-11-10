import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useGetAllMarkets } from "@/hooks/markets.hooks";
import { Market } from "@/types/markets.types";
import { useNavigate } from "react-router-dom";

interface MarketHeadlinerProps {}

const MarketHeadliner: React.FC<MarketHeadlinerProps> = () => {
  const { data, isLoading, isError } = useGetAllMarkets();
  const [market, setMarket] = useState<Market | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching data...");
    if (data && data.length > 0) {
      console.log("Data fetched:", data);
      const highestPotMarket = data.reduce((prev, current) =>
        parseFloat(String(prev.totalPot)) > parseFloat(String(current.totalPot))
          ? prev
          : current
      );
      setMarket(highestPotMarket);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;
  if (!market) return <div>Looking into the future...</div>;

  const handleVote = () => {
    navigate(`/market/${market.id}`);
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg shadow-slate-300 shadow-md p-6 flex flex-col sm:flex-row"
      )}
    >
      <div className="flex-initial mb-4 sm:mb-0 sm:w-1/3 md:max-w-[150px] md:flex md:flex-col md:justify-center">
        <img
          src="https://play-lh.googleusercontent.com/L9ua6NBh7Er2r5dT_eTEbsxeAn7ZGf4cwCiY-cU5gl6O_6PLp85XuCjTPTAdQVfe4Qo"
          alt="Market image"
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="flex-1 sm:ml-8 flex flex-col justify-center">
        <h1 className="font-bold text-2xl sm:text-3xl">{market.name}</h1>
        <p className="text-gray-600 mt-2">{market.description}</p>
        <p className="mt-2 text-xl">
          Add to the Current Pot:{" "}
          <b>{String(market.totalPot).toString()} STX</b>
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Expires at Block #{String(market.endSession).toString()}
        </p>
      </div>

      <div className="flex-initial sm:ml-2 mt-4 sm:mt-0">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
          <Button onClick={handleVote} className="w-full" variant="outline">
            Yes
          </Button>
          <Button
            onClick={handleVote}
            className="w-full mt-2"
            variant="outline"
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketHeadliner;
