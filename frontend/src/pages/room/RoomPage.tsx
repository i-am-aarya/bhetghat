import { roomApi } from "@/api/room"
import { useEffect } from "react"

export default function RoomPage() {

  useEffect(() => {
    const getMembers = async () => {
      await roomApi.getMembers()
    }
  }, [])
  return <div>


    play button here
  </div>
}
