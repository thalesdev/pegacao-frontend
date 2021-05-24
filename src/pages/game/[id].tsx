import dynamic from 'next/dynamic'
import React from 'react'

const GameView = dynamic(() => import('../../Views/game'), { ssr: false })

const Game: React.FC = () => {
  return <GameView />
}

export default Game
