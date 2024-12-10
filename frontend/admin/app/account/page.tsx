import Time from "@/components/Time";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function page() {
  return (
    <div className="ml-4 p-10">
      <Time />
      <div className="w-[993px] pt-10">
        <h1 className="text-4xl font-medium">Accout Settings</h1>
        <div>
          <h1 className="text-2xl font-medium pt-14">Change password</h1>
        </div>
        <div className="pt-16">
          <div className="grid w-full max-w-sm items-cneter gap-1.5 pb-10">
            <Label htmlFor="password">Current Password</Label>
            <Input
              type="password"
              id="currentpassword"
              placeholder="Current Password"
            />
          </div>
          <div className="flex justify-between pb-10">
            <div className="grid w-full max-w-sm items-cneter gap-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="currentpassword"
                placeholder="Current Password"
              />
            </div>
            <div className="grid w-full max-w-sm items-cneter gap-1.5">
              <Label htmlFor="password">Re-enter Password</Label>
              <Input
                type="password"
                id="currentpassword"
                placeholder="Current Password"
              />
            </div>
          </div>
          <div>
            <Button className="w-[150px] has-[40px] bg-[#EB3D77] hover:bg-[#f597b6] hover:text-white">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
