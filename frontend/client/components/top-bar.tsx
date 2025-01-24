import React from 'react'
import { Button } from './ui/button'
import { Phone, PhoneCall } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label';

interface TopBarProps {
  startCall: () => void;
  username: string;
  setUsername: (e: string) => void;
  roomName: string;
  setRoomName: (e: string) => void;

}

const TopBar = ({ startCall, username, setUsername, roomName, setRoomName }: TopBarProps) => {
  return (
    <div className='bg-black bg-opacity-50 p-2 flex items-center justify-between px-8'>

      <div className='flex gap-4 items-center'>
        {/* user's name */}
        <Label
          htmlFor='username-input'
          className="text-white"
        >
          Username:
        </Label>
        <Input
          placeholder='bhagya_neupane'
          className='bg-white'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username-input"
        />

        {/* room name */}
        <Label
          htmlFor='roomname-input'
          className='text-white'
        >
          Room:
        </Label>

        <Input
          placeholder='1234'
          className='bg-white'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="roomname-input"
        />
      </div>

      <div className='flex gap-4'>
        <Button onClick={startCall}><PhoneCall /> Call </Button>
        <Button variant={"secondary"} onClick={() => { alert("does nothing") }}><PhoneCall /> Button </Button>
      </div>

    </div>
  )
}

export default TopBar