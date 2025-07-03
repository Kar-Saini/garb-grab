import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";

type StakeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  stakeAmount: number;
  roomId: string;
};

const StakeModal = ({
  isOpen,
  onClose,
  stakeAmount,
  roomId,
}: StakeModalProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleStake = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: import.meta.env.VITE_PLATFORM_ADDRESS,
          lamports: stakeAmount * 1_000_000_000,
        })
      );
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "processed");
      setStatus("Stake successful!");
      onClose();
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg text-white w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Stake</h2>
        <p className="mb-4">
          You are about to stake{" "}
          <span className="text-purple-400 font-semibold">
            {stakeAmount} SOL
          </span>
          to join room <strong>{roomId}</strong>.
        </p>
        {status && <p className="mb-2 text-sm text-green-400">{status}</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-neutral-600 px-4 py-2 rounded-lg hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleStake}
            className="bg-pink-600 px-4 py-2 rounded-lg hover:bg-pink-700 font-semibold"
          >
            {loading ? "Staking..." : "Confirm Stake"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeModal;
