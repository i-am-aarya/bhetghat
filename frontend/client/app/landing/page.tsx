"use client";

import { useState } from "react";
import Image from "next/image";
import godot from "@/app/images/gotdot.png";
import Bhet from "@/app/images/bhet.png";
import logo from "@/app/images/logo.png";
import check from "@/app/images/check.png";


function LandingPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    setTimeout(() => {
      setIsDownloading(false); 
      alert("Download Started!"); 
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <div
      className="absolute inset-0 bg-cover bg-center z-0 blur-[0.9px]" 
      style={{
        backgroundImage: `url(${Bhet.src})`,
      }}
    ></div>

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Developed By */}
      <div className="absolute  top-10 text-center">
        <p className="text-lg text-[#D91656] font-extrabold">Developed By</p>
        <p
          className="text-lg font-extrabold mb-8"
          style={{
            fontFamily: "Inter",
            fontSize: "18px",
            fontWeight: "800",
            lineHeight: "21.78px",
            textAlign: "left",
          }}
        >
          Arya Bhattarai | Bisham Neupane | Prabal Piya | Sumit Ojha
        </p>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center p-6">
        {/* Logo Image */}
        <Image
          src={logo}
          alt="Bhetghat Logo"
          width={300}
          height={100}
          className="mx-auto mb-6"
        />

        {/* Subtitle */}
        <p
          className="text-4xl font-black text-center mb-4"
          style={{ fontFamily: "Inter", lineHeight: "43.57px" }}
        >
          A 2D Proximity Communication Game
        </p>

        <p
          className="text-base font-bold text-center mb-8"
          style={{
            fontFamily: "Inter",
            fontSize: "16px",
            lineHeight: "19.36px",
          }}
        >
          It is a project we envisioned where players can explore and interact
          with both the world and other players.
        </p>

        

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="px-8 py-3 bg-[#D91656] hover:bg-[#D91656]/90 rounded-lg text-lg font-semibold"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>

        {/* Tech Logos */}
        <div className="flex justify-center items-center gap-8 mt-12">
          {/* Godot Logo */}
          <Image
            src={godot}
            alt="Godot Logo"
            width={250}
            height={250}
            className="w-20 h-20 md:w-28 md:h-28"  
            />
          {/* Check Icon */}
          <Image
            src={check}
            alt="Check Icon"
            width={250}
            height={250}
            className="w-20 h-20 md:w-28 md:h-28"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;