import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 md:pt-28 h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Yosoku.app</h1>
          <p className="mt-4">Main content</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
