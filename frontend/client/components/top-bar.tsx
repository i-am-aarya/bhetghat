import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { MonitorPlay, Phone, PhoneCall } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useAuth from "@/hooks/useAuth";

interface TopBarProps {
  startCall: () => void;
  username: string;
  setUsername: (e: string) => void;
  roomName: string;
  setRoomName: (e: string) => void;

  startPreview: () => void;
}

const TopBar = ({
  startCall,
  username,
  setUsername,
  roomName,
  setRoomName,
  startPreview,
}: TopBarProps) => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("I have been mounted");

    return () => console.log("i have been unmounted");
  }, []);

  return (
    <div className="absolute top-0 w-full bg-black bg-opacity-50 p-2 flex items-center justify-between px-8">
      <div className="flex gap-4 items-center">
        {/* user's name */}
        {/* <p className="text-white">{user?.username}</p> */}
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
              onChange={(e) => {
                e.stopPropagation();
                setUsername(e.target.value);
              }}
              id="username-input"
            />
          </div>
        )}{" "}
        {/* room name */}
        <Label htmlFor="roomname-input" className="text-white">
          Room:
        </Label>
        <Input
          placeholder="1234"
          className="bg-white"
          value={roomName}
          onChange={(e) => {
            e.stopPropagation();
            setRoomName(e.target.value);
          }}
          id="roomname-input"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={startCall}>
          <PhoneCall /> Call{" "}
        </Button>

        <Button variant={"secondary"} onClick={startPreview}>
          <MonitorPlay /> Preview{" "}
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
