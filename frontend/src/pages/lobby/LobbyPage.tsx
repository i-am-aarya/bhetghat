import { roomApi, type Room } from "@/api/room"
import RoomCard from "@/components/RoomCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/api"
import { useAuthStore } from "@/stores/authStore"
import { useRoomStore } from "@/stores/roomStore"
import { ArrowRight, LogIn, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { createBrowserRouter, useNavigate } from "react-router-dom"
import { toast } from "sonner"

function CreateOrJoin() {

  const [roomName, setRoomName] = useState("")
  const [roomCode, setRoomCode] = useState("")

  const navigate = useNavigate()

  const joining = useRoomStore((s) => s.isJoining)
  const joinRoom = useRoomStore((s) => s.joinRoom)

  const creating = useRoomStore((s) => s.isCreating)
  const createRoom = useRoomStore((s) => s.createRoom)
  const currentRoom = useRoomStore((s) => s.currentRoom)

  const [joinError, setJoinError] = useState("")
  const [createError, setCreateError] = useState("")


    const handleCreateRoom = async () => {
      setCreateError("")

      if (roomName.length < 6) {
        setCreateError("at least 6 characters")
      }

      try {
        const room = await createRoom({name: roomName})
        toast.success("Joined a room!")
        if(room) navigate(`/room/${room.roomCode}`)
      } catch (error) {
        toast.error("ERROR", {description: getApiErrorMessage(error)})
      }
    }

  const handleJoinRoom = async () => {
    setJoinError("")
    if (roomCode.length < 6 || roomCode.length > 6) {
      setJoinError("invalid room code")
      return
    }
    try {
      const room = await joinRoom(roomCode)
      toast.success("Joined a room!")
      if(room) navigate(`/room/${room.roomCode}`)
    } catch (error) {
      toast.error("ERROR", { description: getApiErrorMessage(error) })
    }
  }

  return <>
    <p className="mt-20 font-bold font-mono text-sm text-primary">
          CREATE OR JOIN ROOM
        </p>
  <div className="w-full mt-5 flex flex-col md:flex-row gap-10">

    {/* Create Room */}
    <div className="aspect-square md:h-64 flex flex-col border border-border p-6 rounded-xl gap-3 bg-card">
      <div className="border size-fit aspect-square rounded-lg border-primary bg-accent text-primary w-9 h-9 flex justify-center items-center">
        <Plus size={16} strokeWidth={2}/>
      </div>
      <p className="font-head text-foreground font-semibold size-sm">Create a Room</p>
      <p className="text-sm text-muted-foreground mb-5">Start a new space.</p>
      <Input className="" placeholder="Room name" value={roomName} onChange={(e) => {setRoomName(e.target.value)}}/>
      <Button onClick={handleCreateRoom} disabled={creating}>Create &amp; Join</Button>
    </div>

    {/* Join Room */}
    <div className="aspect-square md:h-64 flex flex-col border border-border p-6 rounded-xl gap-3 bg-card">
         <div className="border size-fit aspect-square rounded-lg border-primary bg-accent text-primary w-9 h-9 flex justify-center items-center">
           <LogIn size={16} strokeWidth={2}/>
         </div>
         <p className="font-head text-foreground font-semibold size-sm">Join a Room</p>
         <p className="text-sm text-muted-foreground mb-5">Drop a code below.</p>
         <Input className="font-mono" placeholder="a3fcb2" maxLength={6} value={roomCode} onChange={(e) => {setRoomCode(e.target.value.toUpperCase())}} autoCapitalize="characters"/>
         {
           joinError && <span className="text-red-500 text-xs">{joinError}</span>
         }

      <Button variant={"outline"} onClick={handleJoinRoom} disabled={joining}>
        {joining ? "Loading..." : "Join Room"}
        <ArrowRight/>
      </Button>
       </div>
  </div>
  </>
}

function MyRooms() {

  const isFetching = useRoomStore((s) => s.isFetching)
  // const fetchMyRooms = useRoomStore((s) => s.fetchMyRooms)
  const myRooms = useRoomStore((s) => s.myRooms)

  return <>
    <p className="mt-20 font-bold font-mono text-sm text-primary">
      YOUR ROOMS
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
      {

        isFetching ? (
          <p className="text-muted-foreground text-sm">
                    Fetching your rooms...
                </p>
        ) :

        myRooms.length>0 ? myRooms.map((room) => (
        <RoomCard key={room.id} room={room}/>
      )) : <p className="text-muted-foreground text-sm">
          Join Or Create a Room
      </p>
      }
    </div>
  </>
}

export default function LobbyPage() {

  const user = useAuthStore((s) => s.user)

  const myRooms = useRoomStore((s) => s.myRooms)
  const fetchMyRooms = useRoomStore((s) => s.fetchMyRooms)
  const fetching = useRoomStore((s) => s.isFetching)

  useEffect(() => {
    fetchMyRooms()
  }, [fetchMyRooms])

  return <div className="md:w-3/4 mx-auto h-screen bg-white">
    <p className="mt-20 font-bold font-mono text-sm text-primary">LOBBY</p>
    <p className="text-4xl font-semibold mt-5">
      Hey, <span className="text- font-semibold font-mono">{user?.firstname || user?.username}</span>
    </p>


    { fetching ? <p>
        Fetching your rooms...
    </p> : myRooms.length > 0 ? (
    <>
        <MyRooms/>
        <CreateOrJoin/>
    </>
      ) : (
        <CreateOrJoin/>
    )
    }

  </div>
}
