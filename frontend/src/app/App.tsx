import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppWalletConnectedContext from "./UserWalletConnectedContext";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <AppWalletConnectedContext>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppWalletConnectedContext>
  );
};

export default App;
