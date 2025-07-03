import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameCanvas from "./components/GameCanvas";
import Landing from "./components/Landing";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import { useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import Lobby from "./components/Lobby";
import { AppContextProvider } from "./AppContextProvider";
import { Toaster } from "react-hot-toast";
import Room from "./components/room/Room";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Toaster />
            <AppContextProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/room" element={<Room />} />
                <Route path="/canvas" element={<GameCanvas />} />
                <Route
                  path="*"
                  element={
                    <div className="text-white p-10">404 - Page Not Found</div>
                  }
                />
              </Routes>
            </AppContextProvider>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
