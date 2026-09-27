import { useAuthStore } from "@/stores/authStore";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

export const MENU_ITEMS = [
  {
    to: "/settings",
    name: "Profile",
    icon: <UserIcon />,
  },
  // {
  //   to: "/settings",
  //   name: "Room",
  //   icon: <HomeIcon />,
  // },
  // {
  //   to: "/settings",
  //   name: "Character",
  //   icon: <PersonStandingIcon />,
  // },
  // {
  //   to: "/settings",
  //   name: "Settings",
  //   icon: <SettingsIcon />,
  // },
];

export default function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logOut = useAuthStore((s) => s.logout);
  if (!user) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant={"secondary"}
          className="aspect-square rounded-full h-10 border border-border"
        >
          <UserIcon className="size-5 rounded-full text-primary" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <div className="w-full flex justify-center">{user.username}</div>
        <Separator />

        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem asChild>
            <Link to={item.to}>
              {item.icon}
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            logOut();
          }}
        >
          <LogOutIcon /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
