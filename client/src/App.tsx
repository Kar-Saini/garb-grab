import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameCanvas from "./components/GameCanvas";
import Landing from "./components/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<GameCanvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
