"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import SpriteAnimation from "./sprite-animation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export interface Character {
  id: number;
  name: string;
  url: string;
  description: string;
  color: string;
}

export default function CharacterSelector() {
  const router = useRouter();

  const characters: Character[] = [
    {
      id: 1,
      name: "Male Character",
      url: "/assets/characters/character-male.png",
      description: "A description of the character",
      color: "#4F46E5",
    },
    {
      id: 2,
      name: "Female Character",
      url: "/assets/characters/character-female.png",
      description: "A description of the character",
      color: "#059669",
    },
    {
      id: 3,
      name: "Male Character 2",
      url: "/assets/characters/character-male-2.png",
      description: "A description of the character",
      color: "#DC2626",
    },
  ];

  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    characters[0],
  );

  useEffect(() => {}, [selectedCharacter]);

  const handleStartPlaying = () => {
    router.push("/game");
  };

  const handleCharacterSelect = (character: Character) => {
    localStorage.setItem("characterSpriteURL", character.url);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-8 items-center">
        {/* left side - character preview */}
        <div className="relative h-[500px] bg-white rounded-2xl overflow-hidden shadow-lg border flex flex-col justify-center">
          <SpriteAnimation character={selectedCharacter} />

          <div className="flex flex-col h-full px-8 gap-2">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              {selectedCharacter.name}
            </h2>
            <p className="text-gray-600">{selectedCharacter.description}</p>
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-col justify-between h-full">
          {characters.map((ch) => (
            <CharacterCard
              key={ch.id}
              character={ch}
              isSelected={ch.id === selectedCharacter.id}
              onSelect={() => {
                handleCharacterSelect(ch);
                setSelectedCharacter(ch);
                console.log("selectedID: ", ch.url);
              }}
            />
          ))}

          <Button
            className="py-8 rounded-lg text-lg font-bold"
            onClick={handleStartPlaying}
          >
            Start Playing
          </Button>
        </div>
      </div>

      <div></div>
    </div>
  );
}

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}
const CharacterCard = ({
  character,
  isSelected,
  onSelect,
}: CharacterCardProps) => {
  return (
    <Card
      className={`relative cursor-pointer shadow ${isSelected ? "border-2 border-primary" : "border"}`}
      onClick={onSelect}
    >
      <CardHeader>
        <p className="text-4xl font-bold">{character.name}</p>
      </CardHeader>

      <CardFooter>
        <CardDescription>{character.description}</CardDescription>
      </CardFooter>

      {isSelected && (
        <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </Card>
  );
};
