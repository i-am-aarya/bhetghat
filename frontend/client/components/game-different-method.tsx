import React from 'react'

const GameTest = () => {

  const GODOT_CONFIG = { "args": [], "canvasResizePolicy": 2, "ensureCrossOriginIsolationHeaders": true, "executable": "bhetghat", "experimentalVK": false, "fileSizes": { "bhetghat.pck": 1319968, "bhetghat.wasm": 43016933 }, "focusCanvas": true, "gdextensionLibs": [] };

  const engine = new Engine(GODOT_CONFIG)
  


  return (
    <canvas>

    </canvas>
  )
}

export default GameTest