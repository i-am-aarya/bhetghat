import React, { useEffect, useRef, useState } from 'react'

const transitionDuration = 1000

const LoadingScreen = ({ isVisible, children }: { isVisible: boolean, children?: React.ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(isVisible)
  const nodeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, transitionDuration)
      return () => clearTimeout(timer)
    }

  }, [isVisible])
  return shouldRender ? (
    <div ref={nodeRef} className={`transition-all duration-300 ease-in-out transform w-screen h-screen
      flex justify-center items-center 
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
      p-4 bg-gray-500 text-white rounded-lg shadow-lg`}
    >
      {children || "ANIMATED COMPONENT"}
    </div>
  ) : null;
}

export default LoadingScreen