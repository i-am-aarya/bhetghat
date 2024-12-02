import React from "react";
import { BellDot } from "lucide-react";

function Time() {
  const date = new Date();
  const Bell = BellDot;
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // 'long' for full month name
    day: "numeric",
  });

  return (
    <div className="font-medium text-lg flex w-full justify-between">
      {formattedDate}
      <Bell className="cursor-pointer" />
    </div>
  );
}

export default Time;
