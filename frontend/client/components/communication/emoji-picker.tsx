import { useState } from "react";
import { Button } from "../ui/button";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)} variant={"ghost"} type="button">
        <Smile className="w-5 h-5 text-gray-700" />
      </Button>

      {open && (
        <div className="absolute bottom-10 -right-40 border shadow rounded-xl">
          <Picker
            theme="light"
            data={data}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native);
            }}
            // previewPosition="none"
            // searchPosition="none"
          />
        </div>
      )}
    </div>
  );
}
