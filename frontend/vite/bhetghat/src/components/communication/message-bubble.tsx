import useAuth from "@/hooks/useAuth";
import { Message } from "./chat-box";

export interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  return (
    <div>
      {message.sender === user?.username ? (
        ""
      ) : (
        <p className="text-xs text-gray-500 py-1">{message.sender}</p>
      )}
      <div
        className={`rounded-xl px-4 py-2 ${user?.username === message.sender ? "bg-primary text-white" : "bg-gray-500 text-white"}`}
      >
        <p className="flex-wrap">{message.content}</p>
      </div>
    </div>
  );
}
