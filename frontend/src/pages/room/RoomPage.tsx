import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/stores/roomStore"
import { Copy, Users } from "lucide-react"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"

export default function RoomPage() {
  const room = useRoomStore((s) => s.currentRoom)
  const getByCode = useRoomStore((s) => s.setCurrentRoomByCode)
  const {code} = useParams()

  useEffect(() => {
    if(!code) return

    const fetchData = async () => {
      // await roomApi.getMembers()
      await getByCode(code)
    }

    fetchData()
  }, [])


  if (!room) {
    return <div className="w-full h-full pt-10">
      Loading...
    </div>
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(room.roomCode)
  }

  return <div className="w-full h-full pt-10 max-w-md mx-auto flex justify-center flex-col items-center">
    <p className="font-bold text-6xl">{room?.name}</p>

    <Button variant={"secondary"} className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors my-5" onClick={handleCopyClick}>
      <p className="tracking-wider">{room.roomCode}</p>
        <Copy className="w-4 h-4 text-muted-foreground" strokeWidth={2} size={11}/>
    </Button>


    <div className="border border-border rounded-xl p-5 w-full flex flex-col gap-2">

      <p className="text-sm">Check camera and mic</p>

      <div className="bg-black w-full h-40 text-white">
        <p className="font-bold text-4xl">TODO</p>
      </div>

    </div>


    <div className="border-border border p-4 rounded-xl w-full mt-5 flex flex-col gap-4">
      <div className="flex justify-between w-full">

      <p className="font-bold flex items-center gap-2 text-sm text-foreground/80">
        <Users/>
        Members
      </p>

        <p className="text-sm text-muted-foreground font-semibold">{room.memberCount} / {room.capacity}</p>

      </div>
    <div className="grid grid-rows-2 gap-2">
      {room.members.map((member) => (
        <div key={member.id} className="flex items-center gap-2 rounded-xl w-32 text-sm">
          <p>{member.username}</p>
        </div>
      ))}

    </div>
    </div>


    <div className="border border-border rounded-xl p-4 w-full mt-5">
      <p>
        Room Settings
      </p>

      <p>TODO: room password</p>

    </div>


      <Button className="group w-full mt-5 h-10" asChild>
        <Link to={`/room/${room.roomCode}/play`}>
          Start Playing
        </Link>
      </Button>

  </div>
}
