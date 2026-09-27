import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MENU_ITEMS } from "@/components/UserMenu";
import { useAuthStore } from "@/stores/authStore";
import { LockIcon, UnlockIcon } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [selected, setSelected] = useState("");
  const user = useAuthStore((s) => s.user);
  const [edit, setEdit] = useState(false);
  if (!user) {
    return;
  }
  return (
    <div className="">
      <p className="text-4xl font-bold mt-20">Settings</p>

      <div className="flex mt-10 gap-4">
        <div className="flex flex-col gap-2">
          {MENU_ITEMS.map((item) => (
            <div
              className={`${selected == item.name ? "bg-primary/20 text-primary/80" : "hover:bg-primary/20"} flex gap-2 h-10 w-40 hover:cursor-pointer  items-center p-2 transition-all duration-200 rounded-xl`}
              onClick={() => {
                setSelected(item.name);
              }}
            >
              {item.icon}
              {item.name}
            </div>
          ))}
        </div>
        <Separator orientation="vertical" className="h" />

        <div className="">
          {selected == "" && <p>Select a menu</p>}

          {selected == "Profile" && (
            <>
              <div>
                <p className="text-primary text-sm font-bold font-mono">Name</p>
                <div className="flex flex-col sm:flex-row w-full justify-between gap-10 mt-2">
                  <Input
                    value={user.firstname}
                    placeholder="Firstname"
                    className="w-60"
                    disabled={edit}
                  />
                  <Input
                    value={user.lastname}
                    placeholder="Lastname"
                    className="w-60"
                    disabled={edit}
                  />
                </div>
              </div>

              <div className="mt-10">
                <p className="text-primary text-sm font-bold font-mono">
                  Username
                </p>
                <div className="mt-2">
                  <Input value={user.username} disabled className="w-60" />
                </div>
              </div>

              <div className="mt-10">
                <p className="text-primary text-sm font-bold font-mono">
                  Change Password
                </p>
                <div className="flex flex-col sm:flex-row w-full justify-between gap-10 mt-2">
                  <Input
                    className="w-60"
                    placeholder="Old Password"
                    disabled={edit}
                  />
                  <Input
                    disabled={edit}
                    className="w-60"
                    placeholder="New Password"
                  />
                </div>
              </div>

              <div className="flex w-full justify-between mt-10">
                <Button
                  className="w-40"
                  variant={edit ? "outline" : "destructive"}
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  {edit ? <LockIcon /> : <UnlockIcon />}
                  Edit
                </Button>
                <Button className="w-40">Save Button</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
