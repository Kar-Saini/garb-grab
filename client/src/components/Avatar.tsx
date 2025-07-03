import { AppContext } from "@/AppContextProvider";
import { AVATAR_LIST } from "@/lib/constants";
import { useContext } from "react";

export function AvatarSelector() {
  const { selectedAvatar, setSelectedAvatar } = useContext(AppContext)!;
  const handleSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {AVATAR_LIST.map((avatar, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(avatar)}
            className={`rounded-full border-4 p-1 transition-all ${
              selectedAvatar === avatar
                ? "border-purple-500 scale-110"
                : "border-transparent"
            }`}
          >
            <img
              src={avatar}
              alt={`Avatar ${idx + 1}`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
