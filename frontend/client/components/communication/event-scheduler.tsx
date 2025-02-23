import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { EventSchedulePayload } from "../game/packet";
import { Calendar, Clock, Loader2, Plus, Sparkles, Timer } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface EventSchedulerProps {
  onSchedule: (event: EventSchedulePayload) => void;
}

const QUICK_DELAYS = [
  { minutes: 1, label: "1 minutes", description: "Quick reminder" },
  { minutes: 5, label: "5 minutes", description: "Quick reminder" },
  { minutes: 15, label: "15 minutes", description: "Short break" },
  { minutes: 30, label: "30 minutes", description: "Team sync" },
  { minutes: 60, label: "1 hour", description: "Long meeting" },
];

export const EventScheduler = ({ onSchedule }: EventSchedulerProps) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // event
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDelay, setSelectedDelay] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" && !isVisible) {
        setIsVisible(true);
        e.preventDefault();
      } else if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleSchedule = async () => {
    if (!title || !description || !selectedDelay) return;

    setIsLoading(true);
    try {
      onSchedule({
        title,
        description,
        delay: selectedDelay,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedDelay(0);
    } catch (error) {
      console.error("Failed to schedule event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 0 or 12+ hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const scheduledTime = selectedDelay
    ? formatTime(new Date(Date.now() + selectedDelay * 60 * 1000))
    : null;

  return (
    <Card
      className={cn(`w-full max-w-2xl
      fixed bottom-20 right-20 transition-all duration-300 ease-in-out
      `)}

      // inset-0 z-50
      // mx-auto
      // my-auto
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schedule Event
        </CardTitle>
        <CardDescription>Create an scheduled event</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* event details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-800">
              Event Title
            </Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") e.stopPropagation();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-800">
              Description
            </Label>
            {/* update to Textarea */}
            <textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full p-2 text-sm text-gray-700"
              onKeyDown={(e) => {
                if (e.key !== "Escape") e.stopPropagation();
              }}
            />
          </div>
        </div>
        {/* time delay */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Select Delay
          </Label>

          <div className="flex flex-wrap gap-2">
            {QUICK_DELAYS.map((delay, i) => (
              <Button
                key={i}
                variant={
                  selectedDelay === delay.minutes ? "default" : "outline"
                }
                className={cn(
                  "transition-all",
                  selectedDelay === delay.minutes &&
                    "ring-2 ring-primary ring-offset-2",
                )}
                onClick={() => setSelectedDelay(delay.minutes)}
              >
                {delay.label}
              </Button>
            ))}
          </div>
        </div>
        {/* schedule preview */}
        {scheduledTime && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              Event will be triggered at <strong>{scheduledTime}</strong>
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 justify-end w-full">
          <Button
            onClick={handleSchedule}
            disabled={!title || !description || !selectedDelay || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Schedule Event"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
