import type { Room } from "@/api/room"

export interface RoomCardProps {
  room: Room
}
export default function RoomCard({room}: RoomCardProps) {
  return <div className="rounded-xl border-border border p-6 w-full md:max-w-64">
    {room.name}
  </div>
}
