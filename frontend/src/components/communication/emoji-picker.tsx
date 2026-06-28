import { useState } from "react";
import { Button } from "../ui/button";
import { Smile } from "lucide-react";

export default function EmojiPicker({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const doNothing = () => {
    onSelect("emoji doesn't work");
  };
  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)} variant={"ghost"} type="button">
        <Smile className="w-5 h-5 text-gray-700" />
      </Button>

      {open && (
        <div
          className="absolute bottom-10 -right-40 border shadow rounded-xl"
          onClick={doNothing}
        >
          EMOJI PICKER
        </div>
      )}
    </div>
  );
}
