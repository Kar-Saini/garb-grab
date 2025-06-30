import { INCOMMING_MESSAGE } from "@/lib/types";
import { AppContext } from "@/AppContextProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useContext, useEffect } from "react";
import { AvatarSelector } from "./Avatar";

const Lobby = () => {
  const connection = new Connection("https://rpc.gorbagana.wtf");
  const { socket, userName, setUserName, accountInfo, setAccountInfo } =
    useContext(AppContext)!;
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
    async function getAccountDetails() {
      try {
        const info = await connection.getAccountInfo(publicKey!);
        setAccountInfo(info);
      } catch (error) {
        console.error("Failed to fetch account info:", error);
      }
    }
    getAccountDetails();
  }, [publicKey]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const parsedData: INCOMMING_MESSAGE = JSON.parse(event.data);
      if (parsedData.type === "user-joined-lobby") {
        setAccountInfo((prev) =>
          prev
            ? {
                ...prev,
                userId: parsedData.payload.userId,
                userName: parsedData.payload.userName,
              }
            : prev
        );
      }
    };
  }, [socket]);

  function handleJoinLobby() {
    socket?.send(
      JSON.stringify({
        type: "user-join-lobby",
        payload: { userName },
      })
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-6 font-mono justify-center">
      <h1 className="text-6xl  text-white mb-6">Lobby</h1>
      <div className="bg-neutral-800/70 border border-purple-500 rounded-xl p-6 mb-10 w-full max-w-xl shadow-lg">
        <p className="text-white mb-2 text-md">
          <span className="font-semibold text-purple-400">Wallet:</span>{" "}
          {publicKey ? publicKey.toBase58() : "Not connected"}
        </p>

        {accountInfo && (
          <p className="text-purple-300 text-sm mb-4">
            Balance: {(accountInfo.lamports / 1_000_000_000).toFixed(4)} $GOR
          </p>
        )}

        {accountInfo?.userId ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <InfoCard label="User ID" value={accountInfo.userId} />
            <InfoCard label="User Name" value={accountInfo.userName} />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName ? userName : ""}
              onChange={(e) => setUserName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md bg-purple-950 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              className={`bg-gray-600  px-4 py-2 text-white rounded-md transition cursor-auto ${
                userName &&
                "bg-purple-600 hover:cursor-pointer hover:bg-purple-700"
              }`}
              disabled={!userName || !publicKey}
              onClick={handleJoinLobby}
            >
              Join Lobby
            </button>
          </div>
        )}
      </div>
      {accountInfo?.userName && <AvatarSelector />}
    </div>
  );
};

function InfoCard({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-purple-800 text-white px-4 py-2 rounded-md shadow-md w-full flex items-center gap-2 justify-center">
      <span className="text-sm text-purple-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm truncate">{value}</span>
    </div>
  );
}

export default Lobby;
