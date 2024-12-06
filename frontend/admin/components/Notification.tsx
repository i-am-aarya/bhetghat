"use client";
import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
function Notification() {
  const Mailicon = Mail;
  const [message, setMessage] = useState(2);
  const messageinfo = [
    { msg: "UserID #12345 has been removed.", time: "1 hour ago" },
    { msg: "UserID #12345 has been removed.", time: "1 hour ago" },
  ];
  return (
    <div className="m-2 w-[378px] h-[328px] border-2  absolute ml-[-400px] mt-[-25px] z-[40] bg-white">
      <div className="w-[378px] h-[100px] p-6">
        <h1 className="text-2xl font-bold">Notification</h1>
        <p className="text-sm font-inter text-[#71717A]">
          You have {message} unread messages.
        </p>
      </div>
      <div className="w-[378px] h-[164px] ">
        <ul className="list-disc  px-11 pb-6 text-[#EB3D77]">
          {messageinfo.map((msginfo, index) => (
            <li key={index}>
              <p className="text-sm text-black">{msginfo.msg}</p>
              <p className="text-sm font-inter text-[#71717A]">
                {msginfo.time}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[378px] h-[64px]  flex justify-center">
        <Button className="bg-[#EB3D77] w-[330px] h-[40px] hover:bg-[#f597b6]">
          <Mailicon /> Mark all as read
        </Button>
      </div>
    </div>
  );
}

export default Notification;
