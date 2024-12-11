"use client";

import React, { useState } from "react";
import { BellDot } from "lucide-react";
import Notification from "./Notification";

function Time() {
  const [showNotification, setShowNotification] = useState(false);

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // 'long' for full month name
    day: "numeric",
  });

  return (
    <div className="font-medium text-lg flex w-full justify-between">
      {formattedDate}
      <div>
        <BellDot
          className="cursor-pointer relative "
          onClick={() => setShowNotification((prev) => !prev)}
        />
        {showNotification && <Notification />}
      </div>
    </div>
  );
}

export default Time;
