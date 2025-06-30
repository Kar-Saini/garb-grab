import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Gamepad2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "@/AppContextProvider";

export default function LandingPage() {
  const navigate = useNavigate();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey) {
      setTimeout(() => {
        navigate("/lobby");
      }, 3000);
    }
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center ">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="block p-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
              GARB GRAB
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The ultimate multiplayer coin collection game on Solana. Compete,
            collect, and earn in the most addictive blockchain gaming
            experience.
          </p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 backdrop-blur-xl">
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  Connect Your Wallet
                </h2>
                <p className="text-gray-300">
                  Connect your Solana wallet to start earning real SOL rewards
                </p>
              </div>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !rounded-xl !px-8 !py-4 !text-lg !font-semibold !shadow-lg hover:!scale-105 !transition !transform !duration-300 !border-0" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
