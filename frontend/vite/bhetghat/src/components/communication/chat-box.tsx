import React, { useEffect, useRef, useState } from "react";
import {
  Loader,
  Loader2,
  MessageCircle,
  MessageCircleMore,
  Send,
  SendHorizonal,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EmojiPicker from "./emoji-picker";
import MessageBubble from "./message-bubble";

interface ChatBoxProps {
  sendMessage: (message: string) => void;
  messages: Message[];
}

export interface Message {
  content: string;
  sender: string;
}

const ChatBox = ({ sendMessage: send, messages }: ChatBoxProps) => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // const [messages, setMessages] = useState<Message[]>([]);
  const [newMessages, setNewMessages] = useState(0);
  const [inputMessage, setInputMessage] = useState("");

  const [isSending, setIsSending] = useState(false);

  const endOfMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !open) {
        setOpen(true);
        e.preventDefault();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    send(inputMessage);
    setInputMessage("");

    setIsSending(false);
  };

  return open ? (
    <div
      className={`
      fixed bottom-20 transition-all duration-300 ease-in-out
      ${open ? "left-4" : "-left-full"}
    `}
    >
      <Card>
        <CardHeader>
          <p className="font-bold text-3xl">Chat</p>
        </CardHeader>

        <CardContent>
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[50vh] w-[500px] border rounded-md flex flex-col gap-2 px-4"
          >
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex my-2 ${message.sender === user?.username ? "justify-end" : "justify-start"}`}
              >
                <MessageBubble message={message} key={i} />
              </div>
            ))}
            <div ref={endOfMessageRef}></div>
          </ScrollArea>
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <div className="relative flex w-full gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                }}
                placeholder="Message..."
                className="flex-grow"
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") e.stopPropagation();
                }}
              />

              <div className="absolute right-0">
                <EmojiPicker
                  onSelect={(emoji) => setInputMessage((prev) => prev + emoji)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSending || inputMessage.length === 0}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizonal />
              )}
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <Button
      className="py-4 px-4 fixed left-10 bottom-20"
      onClick={() => {
        setOpen(!open);
      }}
    >
      <MessageCircleMore className="w-5 h-5" />
      View Messages
    </Button>
  );
};

export default ChatBox;
