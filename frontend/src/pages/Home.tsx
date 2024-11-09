import EventHeadliner from "@/components/EventHeadliner";
import Navbar from "@/components/Navbar";

const exampleData = {
  title: "Who comes first in FSAE?",
  options: [
    { name: "Northeastern Electric Racing", percentage: 60 },
    { name: "Boston University Motorsports", percentage: 40 },
  ],
  expirationDate: new Date(),
  imageUrl: "https://placehold.co/150x150",
  pot: "160.1 STX",
};

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 md:pt-28 h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Find the next big market</h1>
          <EventHeadliner className="my-8 bg-gray-300" {...exampleData} />
          <h1 className="text-3xl font-bold">Emerging Markets</h1>
        </div>
      </main>
    </div>
  );
};

export default Home;
