import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppWalletConnectedContext from "./UserWalletConnectedContext";

import Home from "@/pages/Home";
import NewMarket from "@/pages/NewMarket";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <AppWalletConnectedContext>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewMarket />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppWalletConnectedContext>
  );
};

export default App;
