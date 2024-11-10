import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppWalletConnectedContext from "./UserWalletConnectedContext";
import AppContextQuery from "./AppContextQuery";

import Home from "@/pages/Home";
import NewMarket from "@/pages/NewMarket";
import NotFound from "@/pages/NotFound";
import MarketPage from "@/pages/MarketPage";

const App = () => {
  return (
    <AppContextQuery>
      <AppWalletConnectedContext>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewMarket />} />
            <Route path="/market/:marketId" element={<MarketPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppWalletConnectedContext>
    </AppContextQuery>
  );
};

export default App;
