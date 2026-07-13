import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpriteAnimation from "@/components/character-selection/sprite-animation";

export interface Character {
  id: number;
  name: string;
  url: string;
  description: string;
  color: string;
}

export default function CharacterSelectionPage() {
  const navigate = useNavigate();

  const characters: Character[] = [
    {
      id: 1,
      name: "Male Character",
      url: "/assets/characters/character-male.png",
      description: "A brave and strong adventurer ready for any challenge.",
      color: "#4F46E5",
    },
    {
      id: 2,
      name: "Female Character",
      url: "/assets/characters/character-female.png",
      description: "A clever and agile hero with magical talents.",
      color: "#059669",
    },
    {
      id: 3,
      name: "Male Character 2",
      url: "/assets/characters/character-male-2.png",
      description: "A mysterious wanderer with a hidden past.",
      color: "#DC2626",
    },
  ];

  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    characters[0],
  );

  useEffect(() => {
    localStorage.setItem("characterSpriteURL", characters[0].url);
  }, []);

  const handleStartPlaying = () => {
    navigate("/game");
  };

  const handleCharacterSelect = (character: Character) => {
    localStorage.setItem("characterSpriteURL", character.url);
    setSelectedCharacter(character);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Choose Your Character
          </h1>
          {/*<p className="text-gray-500 mt-2">
            Select the character that will join you on your journey
          </p>*/}
          <div className="w-24 h-1 bg-[#d91656] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Character Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
            <div className="relative h-[400px] bg-gray-50 flex items-center justify-center border-b border-gray-200">
              <SpriteAnimation character={selectedCharacter} />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCharacter.name}
              </h2>
              <p className="text-gray-600">
                {selectedCharacter.description || "No description available."}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedCharacter.color }}
                ></div>
                <span className="text-sm text-gray-500">Primary color</span>
              </div>
            </div>
          </div>

          {/* Right side - Character Cards */}
          <div className="space-y-4">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className={`relative cursor-pointer transition-all duration-200 rounded-xl border bg-white p-6 hover:shadow-md ${
                  selectedCharacter.id === character.id
                    ? "border-[#d91656] shadow-md ring-2 ring-[#d91656]/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {character.name}
                    </h3>
                    <p className="text-gray-500 mt-1 text-sm">
                      {character.description || "Click to select this hero"}
                    </p>
                  </div>
                  {selectedCharacter.id === character.id && (
                    <div className="bg-[#d91656] rounded-full p-2 shadow-lg">
                      <svg
                        className="w-5 h-5 text-white"
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
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all duration-300"
                  style={{
                    width:
                      selectedCharacter.id === character.id ? "100%" : "0%",
                    backgroundColor: "#d91656",
                  }}
                ></div>
              </div>
            ))}

            {/* Start Playing Button */}
            <button
              onClick={handleStartPlaying}
              className="w-full mt-6 px-6 py-4 bg-[#d91656] text-white font-bold text-lg rounded-xl shadow-md hover:bg-[#b81248] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#d91656] focus:ring-offset-2"
            >
              Start Playing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
