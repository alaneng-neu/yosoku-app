import MarketHeadliner from "@/components/MarketHeadliner";
import Navbar from "@/components/Navbar";
import InfoSection from "@/components/InfoSection";
import MarketCard from "@/components/MarketCard";

const exampleData = {
  title: "Does Easy-A become the biggest Web3 app?",
  options: [
    { name: "Yes", percentage: 60 },
    { name: "No", percentage: 40 },
  ],
  expirationDate: new Date(),
  imageUrl:
    "https://play-lh.googleusercontent.com/L9ua6NBh7Er2r5dT_eTEbsxeAn7ZGf4cwCiY-cU5gl6O_6PLp85XuCjTPTAdQVfe4Qo",
  pot: "100000000 STX",
};

// Dummy data for emerging markets
const dummyEvents = [
  {
    id: "1",
    name: "Will BTC reach $100K?",
    description: "Predict if Bitcoin will hit $100,000 by the end of the year.",
    totalPot: 50000, // Combined total pot for yes and no bets
    isEnded: false,
    endSession: 100000,
  },
  {
    id: "2",
    name: "Is AI the future?",
    description:
      "Vote on whether AI will become the primary driver of innovation.",
    totalPot: 60000,
    isEnded: false,
    endSession: 100000,
  },
  {
    id: "3",
    name: "Will electric cars dominate?",
    description:
      "Predict if electric vehicles will make up 50% of the market by 2030.",
    totalPot: 100000,
    isEnded: true,
    endSession: 100000,
  },
  {
    id: "4",
    name: "Will ETH reach $5K?",
    description: "Predict if Ethereum will cross the $5,000 mark by next year.",
    totalPot: 150000,
    isEnded: false,
    endSession: 100000,
  },
  {
    id: "5",
    name: "Is Web3 the next big thing?",
    description: "Vote on whether Web3 will revolutionize the internet.",
    totalPot: 100000,
    isEnded: false,
    endSession: 100000,
  },
];

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 md:pt-28 h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Find the next big market</h1>

          {/* Display the MarketHeadliner component with example data */}
          <MarketHeadliner className="my-8 bg-gray-300" {...exampleData} />

          {/* Add the InfoSection component */}
          <InfoSection />

          <h1 className="text-3xl font-bold mt-12">Emerging Markets</h1>

          {/* Display the emerging markets in a 3-column grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {dummyEvents.map((event) => (
              <MarketCard key={event.id} market={event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
