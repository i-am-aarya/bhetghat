"use client";

import Time from "@/components/Time";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
export default function page() {
  const [count, setCount] = useState(4);
  const Actcircle = Circle;
  return (
    <div className="ml-4 p-10">
      <Time />
      <div className="w-[993px] pt-10 ">
        <div className="flex ">
          <h1 className="text-4xl font-medium">Manage Players</h1>
          <h1 className="text-xs font-medium self-end pl-10 flex pr-2 ">
            Currnetly Active
          </h1>
          <Actcircle className="mb-[2px] self-end stroke-[#00FF11] w-[6.67px] h-[6.67px] border-[#00FF11] rounded-full bg-[#00FF11] mr-2 " />
          <span className="self-end text-xs font-medium">{count}</span>
        </div>
        <div></div>
      </div>
    </div>
  );
}
