"use client"
import CallControls from '@/components/call-controls'
import Game from '@/components/game'
// import GameTest from '@/components/game-different-method'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const Play = () => {
  const [inACall, setInACall] = useState(false)

  return (
    <div>
      <Game />
      {/* <Button className='absolute right-0 top-0' onClick={() => { setInACall(!inACall) }}>Toggle Call</Button>
      {
        inACall &&
        <CallControls className={`${inACall ? "" : "invisible"} transition-all`} />
      } */}
    </div>
  )
}

export default Play