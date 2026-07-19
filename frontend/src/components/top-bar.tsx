import { useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuthStore } from "@/stores/authStore";

interface TopBarProps {
  username: string;
}

const TopBar = ({ username }: TopBarProps) => {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    console.log("top bar has been mounted");

    return () => console.log("top bar has been unmounted");
  }, []);

  return (
    <div className="absolute top-0 w-full bg-black/50 p-2 flex items-center justify-between px-8">
      <div className="flex gap-4 items-center">
        {user ? (
          <p className="text-white font-bold text-lg">{user.username}</p>
        ) : (
          <div className="flex justify-center items-center gap-4">
            <Label htmlFor="username-input" className="text-white">
              Username:
            </Label>
            <Input
              placeholder="bhagya_neupane"
              className="bg-white"
              value={username}
              id="username-input"
              disabled
            />
          </div>
        )}
        {/* room name */}
        {/* <Label htmlFor="roomname-input" className="text-white">
          Room:
        </Label>
        <Input
          placeholder="RoomID"
          className="bg-white"
          value={roomID}
          disabled
          id="roomname-input"
        /> */}
      </div>

      {/* <div className="flex gap-4">
        <Button onClick={startCall}>
          <PhoneCall /> Call{" "}
        </Button>

        <Button variant={"secondary"} onClick={startPreview}>
          <MonitorPlay /> Preview{" "}
        </Button>
      </div> */}
    </div>
  );
};

export default TopBar;
