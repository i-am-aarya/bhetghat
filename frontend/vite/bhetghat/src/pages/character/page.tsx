import CharacterSelector from "@/components/character-selection/character-selector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

const RoomsPage = () => {
  const rooms: RoomCardProps[] = [
    { name: "first_room" },
    { name: "arko room" },
    { name: "third" },
  ];

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* <p className="text-5xl font-bold">Character Selection</p> */}
        <h1 className="text-4xl font-bold text-center mb-12">
          Choose Your Character
        </h1>
        <CharacterSelector />
      </div>

      {/* <div className="flex justify-between">
        <p className="text-5xl font-bold">Rooms</p>
        <Button size={"icon"}>
          <Plus />
        </Button>
      </div>
 */}
      {/* <div className="flex gap-3">
        {rooms.map((props, i) => (
          <RoomCard name={props.name} key={i} />
        ))}
      </div> */}
    </div>
  );
};

export default RoomsPage;

type RoomCardProps = {
  name: string;
};

const RoomCard = ({ name }: RoomCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden flex-col w-96 h-60 border shadow-lg relative">
      <div className="text-white bg-black h-full w-full">This is the image</div>

      <div className="absolute bottom-0 bg-gray-200 w-full h-1/3 flex justify-between items-center px-4">
        <p className="font-medium">{name}</p>
        <Button>Join</Button>
      </div>
    </div>
  );
};
