import type { Room } from "@/api/room";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface RoomCardProps {
  room: Room;
}
export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link to={`/room/${room.roomCode}`} className="w-full flex">
      <Button
        className="group p-4 h-16 flex items-center justify-between w-full"
        variant={"outline"}
      >
        <p className="text-lg font-sans truncate text-left">{room.name}</p>
        <ArrowRight className="hidden group-hover:block" />
      </Button>
    </Link>
  );
}
