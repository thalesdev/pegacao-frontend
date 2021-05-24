import React, { createContext, useState } from 'react'

interface GameContextProps {
  app?: any
  warpSpeed: number
  enableWarpedSpeed(): void
}

export const GameContext = createContext(({} as unknown) as GameContextProps)
const GameContextProvider: React.FC = ({ children }) => {
  const [warpSpeed, setWarpSpeed] = useState(0)

  function enableWarpedSpeed() {
    setWarpSpeed(1)
    const t = setTimeout(() => {
      disableWarpedSpeed()
    }, 750)
    return t
  }

  function disableWarpedSpeed() {
    setWarpSpeed(0)
  }

  return (
    <GameContext.Provider value={{ warpSpeed, enableWarpedSpeed }}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContextProvider
