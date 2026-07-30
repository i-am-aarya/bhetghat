import { useAuthStore } from "@/stores/authStore"

export default function LobbyPage() {

  const user = useAuthStore((s) => s.user)

  return <div className="w-1/2 h-1/2 bg-white">
    Lobby

    <p>
      Hey, <span>{user?.firstname || user?.username}</span>
    </p>
  </div>
}
