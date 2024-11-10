import MarketHeadliner from "@/components/MarketHeadliner";
import Navbar from "@/components/Navbar";
import InfoSection from "@/components/InfoSection";
import MarketCard from "@/components/MarketCard";
import { useGetAllMarkets } from "@/hooks/markets.hooks";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading, isError } = useGetAllMarkets();

  return (
    <div>
      <Navbar />
      <main className="pt-16 md:pt-28 h-[calc(100vh-7rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Find the next big market</h1>
          <MarketHeadliner />

          <InfoSection />

          <h1 className="text-3xl font-bold mt-12">Emerging Markets</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {(!data || isLoading || isError) &&
              // create a blank loading card for each of the 3 columns
              [1, 2, 3].map((key) => <MarketCard key={key} isLoading={true} />)}
            {data &&
              data.map((market) => (
                <Link
                  key={`link-${market.id}`}
                  to={`/market/${market.id}`}
                  className="shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg"
                >
                  <MarketCard key={`card-${market.id}`} market={market} />
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
