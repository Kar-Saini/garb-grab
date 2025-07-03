import { Separator } from "@radix-ui/react-separator";
import React, { useContext } from "react";
import { Card, CardContent } from "../ui/card";
import { AppContext } from "@/AppContextProvider";

const AvatarInfoCard = () => {
  const { selectedAvatar, accountInfo } = useContext(AppContext)!;

  return (
    <Card className="bg-neutral-800/70 border-purple-500 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative group">
          <img
            src={selectedAvatar!}
            alt="Selected Avatar"
            width={120}
            height={120}
            className="rounded-full object-cover ring-4 ring-purple-600 shadow-lg group-hover:ring-purple-400 transition-all duration-300"
          />
        </div>

        <div className="w-full space-y-3">
          <div className="text-center">
            <p className="text-sm text-purple-400 uppercase tracking-wide">
              Username
            </p>
            <p className="text-lg font-semibold text-white">
              {accountInfo?.userName}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-400 uppercase tracking-wide">
              User ID
            </p>
            <p className="text-xs font-mono text-gray-300  bg-purple-900 rounded p-2 mt-1">
              {accountInfo?.userId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarInfoCard;
