import GameContainer from "@/components/game/GameContainer";
import { useRoomStore } from "@/stores/roomStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GamePage = () => {
  const getByCode = useRoomStore((s) => s.setCurrentRoomByCode)
  const {code} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!code) {
      navigate("/not-found")
      return
    }
    const fetchData = async () => {
      await getByCode(code)
    }

    fetchData()
  }, [])

  return (
    <div className="w-screen h-screen">
      <GameContainer />
    </div>
  );
};

export default GamePage;
