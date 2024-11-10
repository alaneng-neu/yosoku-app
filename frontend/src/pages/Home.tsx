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
          <h1 className="text-3xl font-bold pb-4">King of the Hill</h1>
          <MarketHeadliner />

          <InfoSection />

          {/* Emerging Markets with Create New Market Button */}
          <div className="flex items-center mt-12">
            <h1 className="text-3xl font-bold mr-8">Emerging Markets</h1>
            <Link
              to="/new"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Create New Market
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-20 mt-8">
            {(!data || isLoading || isError) &&
              [1, 2, 3].map((key) => (
                <div key={key} className="shadow-md rounded-lg min-h-[200px]">
                  <MarketCard isLoading={true} />
                </div>
              ))}
            {data &&
              data.map((market) => (
                <Link
                  key={`link-${market.id}`}
                  to={`/market/${market.id}`}
                  className="shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg min-h-[200px]"
                >
                  <MarketCard market={market} />
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
