"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MessageSquare, Users, Video, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";

function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Multiplayer Experience",
      description: "Explore and interact with other players in real-time",
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Connect face-to-face when near other players",
    },
    {
      icon: MessageSquare,
      title: "Chat System",
      description: "Communicate through text with nearby players",
    },
    {
      icon: Volume2,
      title: "Voice Chat",
      description: "Talk with others in your proximity",
    },
  ];

  const techStack = [
    {
      name: "Aseprite",
      logo: "/assets/logos/aseprite.png",
      link: "#",
    },
    {
      name: "TypeScript",
      logo: "/assets/logos/typescript.svg",
      link: "https://www.typescriptlang.org",
    },
    {
      name: "WebRTC",
      logo: "/assets/logos/webrtc.svg",
      link: "https://webrtc.org",
    },
    {
      name: "WebSocket",
      logo: "/assets/logos/websocket.svg",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket",
    },
    {
      name: "Golang",
      logo: "/assets/logos/go-logo.svg",
      link: "https://golang.org",
    },
    {
      name: "Next.js",
      logo: "/assets/logos/nextjs.svg",
      link: "https://nextjs.org",
    },
  ];

  const router = useRouter();

  const handleStartPlayingClick = () => {
    router.push("/character");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center z-0 blur-sm bg-[url(/assets/images/background-image.png)]" />

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Developed By */}
      <div className="relative z-20 top-10 text-center mb-20">
        <p className="text-primary font-bold text-xl">Developed By</p>
        <div className="text-2xl font-extrabold w-full flex gap-8">
          <p>Arya Bhattarai</p>
          <p>Bisham Neupane</p>
          <p>Prabal Piya</p>
          <p>Sumit Ojha</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center p-6 flex flex-col gap-8">
        {/* Logo Image */}

        <div className="flex justify-center flex-col items-center gap-8">
          <Image
            src={"/assets/icons/title-crisp-filled.png"}
            alt="Bhetghat Logo"
            width={1000}
            height={200}
            style={{ imageRendering: "pixelated" }}
            className="my-10"
          />

          {/* Subtitle */}
          <p className="text-4xl font-black text-center mb-4 mt-2">
            A 2D Proximity Communication Game
          </p>
        </div>

        <p className="text-xl font-bold text-center">
          Explore and interact with both the world and other players in this
          unique multiplayer experience.
        </p>

        {/* Download Button */}
        <div className="flex gap-4 justify-center my-8">
          <Button
            className="text-xl font-black px-8 py-8 hover:-translate-y-2 hover:scale-110 transition-transform duration-400"
            onClick={handleStartPlayingClick}
          >
            START PLAYING
          </Button>
        </div>

        {/* Features */}
        <div>
          {/* <p className="text-white text-5xl font-bold mb-10">FEATURES</p> */}

          <div className="grid grid-cols-4 gap-8 px-40">
            {features.map((feature, i) => (
              <div key={i}>
                <Card className="relative overflow-hidden h-full bg-white/40 p-6 backdrop-blur-lg transition-all hover:bg-white/20">
                  <feature.icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {feature.description}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Logos */}

        <div className="flex flex-col mt-20">
          <p className="text-white font-black text-3xl mb-4">
            MADE WITH ❤️ USING
          </p>
          <div className="flex justify-center items-center gap-16 h-full">
            {techStack.map((tech, i) => (
              <div className="p-4 flex flex-col gap-4 h-full" key={i}>
                <Image
                  src={tech.logo}
                  alt={`${tech.name} Logo`}
                  width={100}
                  height={100}
                  className="w-24 h-24"
                  style={{ imageRendering: "pixelated" }}
                />
                <p className="text-white font-mono font-bold text-lg">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
