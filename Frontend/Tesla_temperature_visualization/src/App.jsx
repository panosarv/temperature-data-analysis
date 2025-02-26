import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Graph from "./pages/Graph";
import AccessDenied from "./pages/AccessDenied";
import "./App.css";

function App() {
  return (
    <div className="relative w-screen h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pastelOrange to-beige via-pastelTea"></div>

      {/* Weather Icon above the gradient */}
      

      {/* Application Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
