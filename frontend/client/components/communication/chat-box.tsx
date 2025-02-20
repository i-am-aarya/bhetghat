import React, { useEffect, useRef, useState } from "react";
import { Loader, Loader2, Send } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChatBoxProps {
  send: () => void;
}

const ChatBox = ({ send }: ChatBoxProps) => {
  const { user } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c" && !isVisible) {
        setIsVisible(true);
        e.preventDefault();
      } else if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [...prev, message]);
    send();
    setMessage("");
  };

  return (
    <div
      className={`
      fixed bottom-20 transition-all duration-300 ease-in-out ${isVisible ? "left-4" : "-left-full"}
    `}
    >
      <Card>
        <CardHeader>Chat</CardHeader>

        <CardContent>
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[300px] border rounded-md"
          >
            {messages.map((message, i) => (
              <div key={i} className="bg-primary text-primary-foreground">
                {message}
              </div>
            ))}
          </ScrollArea>
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Message..."
              className="flex-grow"
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key !== "Escape") e.stopPropagation();
              }}
            />

            <Button type="submit" disabled={loading}>
              <Loader2 className="w-4 h-4 animate-spin" /> Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBox;
